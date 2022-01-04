import * as React from 'react';
import CardHOC from '../hoc/CardHOC';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';
import { BasicDetailsFormFields, basicDetailsValidationRules, EmergencyContactFormFields, emergencyContactValidationRules } from './formFields';
import { reduxForm } from 'redux-form';
import { validate } from '../utils/validation';
import { createResource, createNotification } from '../../actions';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Combobox, DatePicker, InputField } from '../form-fields';

interface ICreateUserProps {
    submit: (data: React.FormEvent<typeof Form>) => void;
}

interface ICreateUserFormProps {
    handleSubmit?: (data: React.FormEvent<typeof Form>) => void;
    onSubmit?: (data: React.FormEvent<typeof Form>) => void;
}


const createUserValidationRules: EL.IValidationFields = {
    ...basicDetailsValidationRules,
    password: { name: 'Password', required: true },
    passwordConfirmation: { name: 'Password confirmation', required: true, sameAs: { fieldName: 'password', fieldDisplayName: 'password' } },
};

@(reduxForm({ form: 'create-user-form', validate: values => validate(createUserValidationRules, values) }) as any)
class CreateUserForm extends React.PureComponent<ICreateUserFormProps> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <BasicDetailsFormFields />

                <InputField name="password" label="Password" type="password" required />
                <InputField name="passwordConfirmation" label="Password Confirmation" type="password" required />

                <hr />

                <React.Fragment>
                    <Button variant="primary" className="pull-right" type="submit">Create User</Button>
                </React.Fragment>
            </Form>
        );
    }
}


@CardHOC<ICreateUserProps>('Create User')
class CreateUser extends React.PureComponent<ICreateUserProps> {
    render() {
        return <CreateUserForm onSubmit={this.props.submit} />;
    }
}

export default connect(
    undefined,
    {
        submit: (data: React.FormEvent<typeof Form>) => {
            const url = 'users';
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('User created.'), (response) => push(`/my-profile/organisation/users/${response.userId}`)],
                onFailure: [createNotification('User creation failed. Please try again.', true)],
            };

            return createResource(url, data, meta)
        }
    }
)(CreateUser as any);