import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import Table from '../dataTable';
import { UserCPDPRHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHours } from '../utils';
import { Button, ButtonGroup, ButtonToolbar, Glyphicon, Row, Col } from 'react-bootstrap';
import { updateCPDPRYearIndex, showCreateCPDPRModal, hideCreateCPDPRModal } from '../../actions/index';
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
    updateCPDPRYearIndex: (year: number) => EvolutionUsers.IAction;
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
                                <td>{minutesToHours(record.minutes)}</td>
                            </tr>
                        ))
                    }
                </tbody>

                <tfoot>
                    <tr key="total">
                        <th colSpan={3} className="text-right">Total:</th>
                        <th>{minutesToHours(this.props.recordSet.minutes)}</th>
                    </tr>
                </tfoot>
            </Table>
        );
    }
}

@connect(
    ({ cpdpr }) => ({ userId: 1, yearEndingIndex: cpdpr.yearEndingIndex, createModalVisible: cpdpr.createModalVisible }),
    { updateCPDPRYearIndex, showCreateCPDPRModal, hideCreateCPDPRModal }
)
@UserCPDPRHOC()
@PanelHOC([props => props.cpdpr])
class UserCPDPR extends React.PureComponent<ICPDPRProps, EvolutionUsers.Stateless> {
    constructor(props: ICPDPRProps) {
        super(props);

        this.prevYear = this.prevYear.bind(this);
        this.nextYear = this.nextYear.bind(this);

        this.submitNewRecord = this.submitNewRecord.bind(this);
    }

    nextYear() {
        this.props.updateCPDPRYearIndex(this.props.yearEndingIndex - 1);
    }

    prevYear() {
        this.props.updateCPDPRYearIndex(this.props.yearEndingIndex + 1);
    }

    submitNewRecord() {
        console.log('dadada');
    }

    render() {
        const years = this.props.cpdpr.data.map(record => record.yearEnding);
        const currentYear = years[this.props.yearEndingIndex];
        const currentRecordSet = this.props.cpdpr.data[this.props.yearEndingIndex];

        const disablePrevButton = this.props.yearEndingIndex === this.props.cpdpr.data.length - 1;
        const disableNextButton = this.props.yearEndingIndex === 0;

        return (
            <div>
                <strong>Yearly Period:</strong>

                <div className="row title-row">
                    <div className="col-xs-12">
                        <ButtonToolbar className="pull-right">
                            <Button onClick={this.props.showCreateCPDPRModal}><Icon iconName="plus" />&nbsp;&nbsp;Add</Button>
                            <ButtonGroup>
                                <Button disabled={disablePrevButton} onClick={this.prevYear}><Icon iconName="arrow-left" /></Button>
                                <Button disabled={disableNextButton} onClick={this.nextYear}><Icon iconName="arrow-right" /></Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                        
                        <h3>1 April {currentRecordSet.yearEnding - 1} to 31 March {currentRecordSet.yearEnding}</h3>
                    </div>
                </div>

                <hr />

                <CPDPRTable recordSet={currentRecordSet} />

                { this.props.createModalVisible && 
                    <FormModal formName="cpdpr-form" hide={this.props.hideCreateCPDPRModal}>
                        <CPDPRForm onSubmit={this.submitNewRecord} />
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