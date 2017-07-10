import * as React from 'react';
import { Field, reduxForm, submit, FormComponentProps, FormProps } from 'redux-form';
import { Row, Col } from 'react-bootstrap';
import FieldComponent from '../formFields/fieldComponent';
import * as moment from 'moment';

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
            </form>
        );
    }
}

function validateCPDPRForm(values: any) {
    let errors: EvolutionUsers.IValidationErrors = {};

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

export default reduxForm({
    form: 'cpdpr-form',
    validate: validateCPDPRForm
})(CPDPRForm);