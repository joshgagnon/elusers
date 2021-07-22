import * as React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Row, Col, Form } from 'react-bootstrap';
import { DatePicker, DurationField, InputField } from '../form-fields';
import * as moment from 'moment';

interface ICPDPRFormProps {
    handleSubmit: React.EventHandler<React.FormEvent<Form>>;
}

const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

class CPDPRForm extends React.PureComponent<ICPDPRFormProps> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <DatePicker name="date" label="Date" required />
                <DurationField name="minutes" label="Duration" required />
                <InputField name="title" label="Title" type="text" required />
                <InputField name="reflection" label="Reflection" type="textarea" required />
            </Form>
        );
    }
}

function validateCPDPRForm(values: any) {
    let errors: EL.ValidationErrors = {};

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
    else if (!moment(values.date, 'D MMMM YYYY', true).isValid()) {
        errors.date = 'Invalid date format';
    }

    if (values.minutes === undefined) {
        errors.minutes = 'Required';
    }
    else if (values.minutes <= 0) {
        errors.minutes = 'Duration must be more than 0';
    }

    return errors;
}

export default (reduxForm({
    form: 'cpdpr-form',
    validate: validateCPDPRForm
}) as any)(CPDPRForm);