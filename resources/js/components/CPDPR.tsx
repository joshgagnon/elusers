import * as React from 'react';
import PanelHOC from './hoc/panelHOC';
import Table from './dataTable';
import { UserCPDPRHOC } from './hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHours } from './utils';
import { Button, ButtonGroup, ButtonToolbar, Glyphicon, Row, Col, FormGroup, ControlLabel, HelpBlock, FormControl, Modal } from 'react-bootstrap';
import { updateCPDPRYearIndex } from '../actions/index';
import * as moment from 'moment';
import { Field, reduxForm, submit } from 'redux-form';
import { SingleDatePicker } from 'react-dates';


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

interface ICPDPRTableState {}

interface ICPDPRProps {
    userId: number;
    cpdpr: EvolutionUsers.IResource<ICPDPRData[]>;
    updateCPDPRYearIndex: (year: number) => EvolutionUsers.IAction;
    yearEndingIndex: number;
}

interface ICPDPRState {}

interface IUserCPDPRProps {
    userId: number;
    yearEndingIndex: number;
}
interface IUserCPDPRState {}

class CPDPRTable extends React.PureComponent<ICPDPRTableProps, ICPDPRTableState> {
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

class BootstrapField extends React.PureComponent<any, {}> {
    componentClass(type: string) {
        switch (type) {
            case 'textarea':
                return type;
            default:
                return 'input';
        }
    }

    validationState(touched: boolean, error: string) {
        if (!touched) {
            return null;
        }

        return error ? 'error' : 'success';
    }

    render() {
        const { input, label, type, meta: { touched, error, warning } } = this.props;
        const displayError = touched && error;

        return (
            <FormGroup validationState={this.validationState(touched, error)}>
                <ControlLabel>{label}</ControlLabel>
                <div>
                    <FormControl {...input} componentClass={this.componentClass(type)} type={type} placeholder={label} />
                    { displayError && <HelpBlock>{error}</HelpBlock>}
                </div>
            </FormGroup>
        );
    }
}

class DatePickerField extends React.PureComponent<any, {}> {
    render() {
        // debugger;
        const { input, label, type, meta: { active, touched, error, warning } } = this.props;

        return (
            <FormGroup validationState={null}>
                <SingleDatePicker
                    id="date_input"
                    numberOfMonths={1}
                    date={input.value || moment()}
                    focused={active}
                    onDateChange={input.onChange}
                    onFocusChange={input.onFocus}
                    hideKeyboardShortcutsPanel={true}
                />
            </FormGroup>
        );
    }
}

class CPDPRForm extends React.PureComponent<{ submitting: boolean; handleSubmit: Function; }, {}> {
    render() {
        return (
            <form onSubmit={ this.props.handleSubmit }>
                <Row>
                    <Col sm={6}>
                        <Field name="date" label="Date" component={BootstrapField} type="date" />
                    </Col>
                    <Col sm={6}>
                        <Field name="hours" label="Hours" component={BootstrapField} type="number" />
                    </Col>
                </Row>

                <Field name="title" label="Title" component={BootstrapField} type="text" />
                <Field name="reflection" label="Reflection" component={BootstrapField} type="textarea" />


                <Field name="date2" label="Date" component={DatePickerField} />

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
    else if (!moment(values.date, 'MM/DD/YYYY', true).isValid()) {
        errors.date = 'Invalid date format';
    }

    return errors
}

const ReduxCPDPRForm = reduxForm({
    form: 'cpdpr-form',
    validate: validateCPDPRForm
})(CPDPRForm);

@PanelHOC([props => props.cpdpr])
class UserCPDPR extends React.PureComponent<ICPDPRProps, ICPDPRState> {
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
    dispatch: Function;
}

interface IFormModalState {}

@connect()
class FormModal extends React.PureComponent<IFormModalProps, IFormModalState> {
    render() {
        return (
            <Modal show={false} onHide={() => {}}>
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

@connect(
    ({ cpdpr }) => ({ userId: 1, yearEndingIndex: cpdpr.yearEndingIndex }),
    { updateCPDPRYearIndex }
)
@UserCPDPRHOC()
export default class CPDPR extends React.PureComponent<IUserCPDPRProps, IUserCPDPRState> {
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