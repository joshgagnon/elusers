import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { Combobox, DatePicker, InputField } from '../form-fields';
import { reduxForm } from 'redux-form';

interface IBasicDetailsFormProps {
    user: EL.User;
    handleSubmit: (data: object) => void;
}

@reduxForm({ form: 'user-form', validate: validateMyProfileForm })
export default class BasicDetailsForm extends React.PureComponent<IBasicDetailsFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={ this.props.handleSubmit } horizontal>
                <Combobox name="title" label="Title" data={["Mr", "Mrs", "Ms"]} />
                
                <InputField name="firstName" label="First Name" type="text" />
                <InputField name="middleName" label="Middle Name" type="text" />
                <InputField name="surname" label="Surname" type="text" />

                <InputField name="preferredName" label="Preferred Name" type="text" />

                <InputField name="email" label="Email" type="email" />

                <DatePicker name="lawAdmissionDate" label="Law Admission Date" />
                <InputField name="irdNumber" label="IRD Number" type="text" />
                <InputField name="bankAccountNumber" label="Bank Account Number" type="text" />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Save</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}

function validateMyProfileForm(values: any) {
    let errors: EL.ValidationErrors = {};

    // Title
    if (!values.title) {
        errors.title = 'Required';
    } else if (values.title.length > 255) {
        errors.title = 'Must be 255 characters or less';
    }

    return errors
}