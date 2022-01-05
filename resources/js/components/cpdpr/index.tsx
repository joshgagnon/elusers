import * as React from 'react';
import CardHOC from '../hoc/CardHOC';
import Table from '../dataTable';
import { UserCPDPRHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHoursString } from '../utils';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { updateCPDPRYearIndex, deleteResource, confirmAction } from '../../actions/index';
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

class CPDPRTableRow extends React.PureComponent<ICPDPRTableRowProps> {
    renderButtons() {
        if (this.props.record.editable) {
            const editLink = `cpdpr/${this.props.record.id}/edit`;

            return (
                <React.Fragment>
                    <Link to={editLink} className="btn btn-info btn-sm">Edit</Link>
                    <Button variant="danger" size="sm" onClick={this.props.deleteRecord}>Delete</Button>
                </React.Fragment>
            );
        }
    }

    render() {
        const { record } = this.props;
        return (
            <tr>
                <td>{moment(record.date).format('D MMMM YYYY')}</td>
                <td>{record.title}</td>
                <td>{record.reflection}</td>
                <td>{minutesToHoursString(record.minutes)}</td>
                <td>{this.renderButtons()}</td>
            </tr>
        );
    }
}

class CPDPRTable extends React.PureComponent<ICPDPRTableProps> {
    render() {
        const HEADINGS = ['Date', 'Title', 'Reflection', 'Hours', 'Actions'];

        return (
            <Table headings={HEADINGS} manualBodyTag lastColIsActions>
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


@UserCPDPRHOC()
@CardHOC<ICPDPRProps>('Professional Development Records', props => props.cpdpr)
class UserCPDPR extends React.PureComponent<ICPDPRProps> {
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
                            <Link to="cpdpr/create" className="btn btn-default"><Icon iconName="plus" />Add</Link>
                            <ButtonGroup>
                                <Button className="btn-icon-only" disabled={disablePrevButton} onClick={() => prevYear(yearEndingIndex)}><Icon iconName="arrow-left" /></Button>
                                <Button className="btn-icon-only" disabled={disableNextButton} onClick={() => nextYear(yearEndingIndex)}><Icon iconName="arrow-right" /></Button>
                            </ButtonGroup>
                        </React.Fragment>

                        <h3>1 April {currentRecordSet.yearEnding - 1} to 31 March {currentRecordSet.yearEnding}</h3>
                    </div>
                </div>

                <hr />

                <CPDPRTable recordSet={currentRecordSet} deleteRecord={this.props.deleteRecord} />
            </div>
        );
    }
}

const ConnectedUserCPDPR = (connect(
    (state: EL.State) => ({
        user: state.user,
        yearEndingIndex: state.cpdpr.yearEndingIndex,
        createModalVisible: state.cpdpr.createModalVisible
    }),
    {
        prevYear: (currentIndex) => updateCPDPRYearIndex(currentIndex + 1),
        nextYear: (currentIndex) => updateCPDPRYearIndex(currentIndex - 1),
        deleteRecord: (recordId: number) => {
            const deleteAction = deleteResource(`cpdpr/${recordId}`);
            
            return confirmAction({
                title: 'Confirm Delete CPDPR Record',
                content: 'Are you sure you want to delete this CPDPR Record?',
                acceptButtonText: 'Delete',
                declineButtonText: 'Cancel',
                onAccept: deleteAction
            });
        }
    }
) as any)(UserCPDPR);


export default class CPDPRPage extends React.PureComponent {
    render() {
        return (
            <div>
                <ConnectedUserCPDPR />

                {this.props.children && this.props.children}
            </div>
        );
    }
}