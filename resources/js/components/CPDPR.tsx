import * as React from 'react';
import PanelHOC from './hoc/panelHOC';
import Table from './dataTable';
import { UserCPDPRHOC } from './hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHours } from './utils';
import { Button, ButtonGroup, ButtonToolbar, Glyphicon, Row, Col, Modal } from 'react-bootstrap';
import { updateCPDPRYearIndex } from '../actions/index';
import * as moment from 'moment';
import { Field, reduxForm, submit, FormComponentProps, FormProps } from 'redux-form';
import FieldComponent from './formFields/fieldComponent';


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
}

interface IUserCPDPRProps {
    userId: number;
    yearEndingIndex: number;
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

interface ICPDPRFormProps {
    submitting: boolean;
    handleSubmit: React.EventHandler<React.FormEvent<HTMLFormElement>>;
}

class CPDPRForm extends React.PureComponent<ICPDPRFormProps, EvolutionUsers.Stateless> {
    render() {
        return (
            <form onSubmit={ this.props.handleSubmit }>
                <Row>
                    <Col sm={6}>
                        <Field name="date" label="Date" component={FieldComponent} type="date" />
                    </Col>
                    <Col sm={6}>
                        <Field name="hours" label="Hours" component={FieldComponent} type="number" />
                    </Col>
                </Row>

                <Field name="title" label="Title" component={FieldComponent} type="text" />
                <Field name="reflection" label="Reflection" component={FieldComponent} type="textarea" />

                <Button type="submit" bsStyle="primary" disabled={this.props.submitting}>Save</Button>
            </form>
        );
    }
}

interface IValidationErrors {
    [key: string]: string
}

function validateCPDPRForm(values: any) {
    let errors: IValidationErrors = {};

    // Title
    if (!values.title) {
        errors.title = 'Required';
    } else if (values.title.length > 255) {
        errors.title = 'Must be 255 characters or less';
    }

    if (!values.reflection) {
        errors.reflection = 'Required';
    }

    if (!values.date) {
        errors.date = 'Required';
    }
    else if (!moment(values.date, 'D MMM YYYY', true).isValid()) {
        errors.date = 'Invalid date format';
    }

    if (!values.hours) {
        errors.hours = 'Required';
    }
    else if (values.hours <= 0) {
        errors.hours = 'Hours must be more than 0';
    }

    return errors
}

const ReduxCPDPRForm = reduxForm({
    form: 'cpdpr-form',
    validate: validateCPDPRForm
})(CPDPRForm);

@connect(
    ({ cpdpr }) => ({ userId: 1, yearEndingIndex: cpdpr.yearEndingIndex }),
    { updateCPDPRYearIndex }
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
                            <Button><Glyphicon glyph="plus" />&nbsp;&nbsp;Add</Button>
                            <ButtonGroup>
                                <Button disabled={disablePrevButton} onClick={this.prevYear}><Glyphicon glyph="arrow-left" /></Button>
                                <Button disabled={disableNextButton} onClick={this.nextYear}><Glyphicon glyph="arrow-right" /></Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                        
                        <h3>1 April {currentRecordSet.yearEnding - 1} to 31 March {currentRecordSet.yearEnding}</h3>
                    </div>
                </div>

                <hr />

                <CPDPRTable recordSet={currentRecordSet} />

                <FormModal formName="cpdpr-form">
                    <ReduxCPDPRForm onSubmit={this.submitNewRecord} />
                </FormModal>
            </div>
        );
    }
}

interface IFormModalProps {
    formName: string;
    children: any;
}

@connect()
class FormModal extends React.PureComponent<IFormModalProps, EvolutionUsers.Stateless> {
    render() {
        return (
            <Modal show={true} onHide={() => {}}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-sm">Create CPDPR Record</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => this.props.dispatch(submit(this.props.formName))}>Save</Button>
                    <Button onClick={() => console.log('hide!')}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default class CPDPRPage extends React.PureComponent<IUserCPDPRProps, EvolutionUsers.Stateless> {
    render() {
        // debugger;
        return (
            <div>
                <h2>CPDPR</h2>
                <UserCPDPR { ...this.props } />
            </div>
        );
    }
}