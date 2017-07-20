import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { InputField } from '../form-fields';
import { reduxForm } from 'redux-form';

@reduxForm({ form: 'emergency-contact-form', validate: () => ({}) })
export default class EmergencyContactForm extends React.PureComponent<{}, EL.Stateless> {
    render() {
        return (
            <Form horizontal>
                <InputField name="firstName" label="First Name" type="text" />
                <InputField name="middleName" label="Middle Name" type="text" />
                <InputField name="surname" label="Surname" type="text" />
            </Form>
        );
    }
}