import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import Table from '../dataTable';
import { UserCPDPRHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHoursString } from '../utils';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { updateCPDPRYearIndex, deleteResource } from '../../actions/index';
import * as moment from 'moment';
import Icon from '../icon';
import { Link } from 'react-router';

interface ICPDPRData {
    records: EL.CPDPR.Record[];
    minutes: number;
    yearEnding: number;
};

interface ICPDPRTableProps {
    recordSet: ICPDPRData;
    deleteRecord: (recordId: number) => void;
}

interface ICPDPRProps {
    userId: number;
    cpdpr: EL.Resource<ICPDPRData[]>;
    prevYear: (currentIndex : number) => EL.Actions.Action;
    nextYear: (currentIndex: number) => EL.Actions.Action;
    yearEndingIndex: number;
    deleteRecord: (recordId: number) => void;
}

interface ICPDPRTableRowProps {
    record: EL.CPDPR.Record;
    deleteRecord: () => void;
}

class CPDPRTableRow extends React.PureComponent<ICPDPRTableRowProps, EL.Stateless> {
    renderButtons() {
        if (this.props.record.editable) {
            const editLink = `cpdpr/${this.props.record.id}/edit`;

            return (
                <ButtonToolbar>
                    <Link to={editLink} className="btn btn-info btn-sm">Edit</Link>
                    <Button bsStyle="danger" bsSize="sm" onClick={this.props.deleteRecord}>Delete</Button>
                </ButtonToolbar> 
            );
        }
    }

    render() {
        const { record } = this.props;
        return (
            <tr>
                <td>{moment(record.date).format('D MMM YYYY')}</td>
                <td>{record.title}</td>
                <td>{record.reflection}</td>
                <td>{minutesToHoursString(record.minutes)}</td>
                <td>{this.renderButtons()}</td>
            </tr>
        );
    }
}

class CPDPRTable extends React.PureComponent<ICPDPRTableProps, EL.Stateless> {
    render() {
        const HEADINGS = ['Date', 'Title', 'Reflection', 'Hours', 'Actions'];

        return (
            <Table headings={HEADINGS} manualBodyTag>
                <tbody>
                    {
                        this.props.recordSet.records.map(record =>
                            <CPDPRTableRow
                                key={record.id}
                                record={record}
                                deleteRecord={() => this.props.deleteRecord(record.id)} />)
                    }
                </tbody>

                <tfoot>
                    <tr key="total">
                        <th colSpan={3} className="text-right">Total:</th>
                        <th>{minutesToHoursString(this.props.recordSet.minutes)}</th>
                        <td></td>
                    </tr>
                </tfoot>
            </Table>
        );
    }
}

@connect(
    (state: EL.State) => ({
        userId: state.user.id,
        yearEndingIndex: state.cpdpr.yearEndingIndex,
        createModalVisible: state.cpdpr.createModalVisible
    }),
    {
        prevYear: (currentIndex) => updateCPDPRYearIndex(currentIndex + 1),
        nextYear: (currentIndex) => updateCPDPRYearIndex(currentIndex - 1),
        deleteRecord: (recordId: number) => deleteResource(`cpdpr/${recordId}`)
    }
)
@UserCPDPRHOC()
@PanelHOC([props => props.cpdpr])
class UserCPDPR extends React.PureComponent<ICPDPRProps, EL.Stateless> {
    render() {
        const { cpdpr, yearEndingIndex, nextYear, prevYear } = this.props;

        const years = cpdpr.data.map(record => record.yearEnding);
        const currentYear = years[yearEndingIndex];
        const currentRecordSet = cpdpr.data[yearEndingIndex];

        const disablePrevButton = yearEndingIndex === cpdpr.data.length - 1;
        const disableNextButton = yearEndingIndex === 0;

        return (
            <div>
                <strong>Yearly Period:</strong>

                <div className="row title-row">
                    <div className="col-xs-12">
                        <ButtonToolbar className="pull-right">
                            <Link to="cpdpr/create" className="btn btn-default"><Icon iconName="plus" />&nbsp;&nbsp;Add</Link>
                            <ButtonGroup>
                                <Button disabled={disablePrevButton} onClick={() => prevYear(yearEndingIndex)}><Icon iconName="arrow-left" /></Button>
                                <Button disabled={disableNextButton} onClick={() => nextYear(yearEndingIndex)}><Icon iconName="arrow-right" /></Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                        
                        <h3>1 April {currentRecordSet.yearEnding - 1} to 31 March {currentRecordSet.yearEnding}</h3>
                    </div>
                </div>

                <hr />

                <CPDPRTable recordSet={currentRecordSet} deleteRecord={this.props.deleteRecord} />
            </div>
        );
    }
}

export default class CPDPRPage extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return (
            <div>
                <h2>CPDPR</h2>
                <UserCPDPR />

                {this.props.children && this.props.children}
            </div>
        );
    }
}