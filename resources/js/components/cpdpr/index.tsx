import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import Table from '../dataTable';
import { UserCPDPRHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHoursString } from '../utils';
import { Button, ButtonGroup, ButtonToolbar, Glyphicon, Row, Col } from 'react-bootstrap';
import { updateCPDPRYearIndex, showCreateCPDPRModal, hideCreateCPDPRModal, createResource } from '../../actions/index';
import * as moment from 'moment';
import { Field, reduxForm, submit, FormComponentProps, FormProps } from 'redux-form';
import FieldComponent from '../formFields/fieldComponent';
import FormModal from '../formModal';
import CPDPRForm from './form';
import Icon from '../icon';


interface ICPDPRData {
    records: {
        id: number;
        title: string;
        date: string;
        reflection: string;
        minutes: number;
    }[];
    minutes: number;
    yearEnding: number;
};

interface ICPDPRTableProps {
    recordSet: ICPDPRData;
}

interface ICPDPRProps {
    userId: number;
    cpdpr: EvolutionUsers.IResource<ICPDPRData[]>;
    prevYear: (currentIndex : number) => EvolutionUsers.IAction;
    nextYear: (currentIndex: number) => EvolutionUsers.IAction;
    yearEndingIndex: number;
    showCreateCPDPRModal: Function;
    hideCreateCPDPRModal: Function;
    createModalVisible: boolean;
}

class CPDPRTable extends React.PureComponent<ICPDPRTableProps, EvolutionUsers.Stateless> {
    render() {
        const HEADINGS = ['Date', 'Title', 'Reflection', 'Hours'];

        return (
            <Table headings={HEADINGS} manualBodyTag>
                <tbody>
                    {
                        this.props.recordSet.records.map(record => (
                            <tr key={record.id}>
                                <td>{moment(record.date).format('D MMM YYYY')}</td>
                                <td>{record.title}</td>
                                <td>{record.reflection}</td>
                                <td>{minutesToHoursString(record.minutes)}</td>
                            </tr>
                        ))
                    }
                </tbody>

                <tfoot>
                    <tr key="total">
                        <th colSpan={3} className="text-right">Total:</th>
                        <th>{minutesToHoursString(this.props.recordSet.minutes)}</th>
                    </tr>
                </tfoot>
            </Table>
        );
    }
}

@connect(
    ({ cpdpr }) => ({ userId: 1, yearEndingIndex: cpdpr.yearEndingIndex, createModalVisible: cpdpr.createModalVisible }),
    {
        prevYear: (currentIndex) => updateCPDPRYearIndex(currentIndex + 1),
        nextYear: (currentIndex) => updateCPDPRYearIndex(currentIndex - 1),
        showCreateCPDPRModal,
        hideCreateCPDPRModal,
        createRecord: (userId: number, data: object) => createResource(`users/${userId}/cpdpr`, data)
    }
)
@UserCPDPRHOC()
@PanelHOC([props => props.cpdpr])
class UserCPDPR extends React.PureComponent<ICPDPRProps, EvolutionUsers.Stateless> {
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
                            <Button onClick={this.props.showCreateCPDPRModal}><Icon iconName="plus" />&nbsp;&nbsp;Add</Button>
                            <ButtonGroup>
                                <Button disabled={disablePrevButton} onClick={() => prevYear(yearEndingIndex)}><Icon iconName="arrow-left" /></Button>
                                <Button disabled={disableNextButton} onClick={() => nextYear(yearEndingIndex)}><Icon iconName="arrow-right" /></Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                        
                        <h3>1 April {currentRecordSet.yearEnding - 1} to 31 March {currentRecordSet.yearEnding}</h3>
                    </div>
                </div>

                <hr />

                <CPDPRTable recordSet={currentRecordSet} />

                { this.props.createModalVisible && 
                    <FormModal formName="cpdpr-form" hide={this.props.hideCreateCPDPRModal}>
                        <CPDPRForm onSubmit={(data) => this.props.createRecord(this.props.userId, data)} />
                    </FormModal>
                }
            </div>
        );
    }
}

export default class CPDPRPage extends React.PureComponent<EvolutionUsers.Propless, EvolutionUsers.Stateless> {
    render() {
        return (
            <div>
                <h2>CPDPR</h2>
                <UserCPDPR />
            </div>
        );
    }
}