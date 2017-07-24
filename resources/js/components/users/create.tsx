import * as React from 'react';
import PanelHOC from '../hoc/panelHoc';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';
import { BasicDetailsFormFields, basicDetailsValidationRules, EmergencyContactFormFields, emergencyContactValidationRules } from './formFields';
import { reduxForm } from 'redux-form';
import { validate } from '../utils/validation';
import { createResource, createNotification } from '../../actions';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Combobox, DatePicker, InputField } from '../form-fields';

interface ICreateUserProps {
    submit: (data: React.FormEvent<Form>) => void;
}

interface ICreateUserFormProps {
    handleSubmit: (data: React.FormEvent<Form>) => void;
}

@connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>) => {
            const url = 'users';
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('User created.'), push('/users')],
                onFailure: [createNotification('User creation failed. Please try again.', true)],
            };

            return createResource(url, data, meta)
        }
    }
)
@PanelHOC('Create User')
export default class CreateUser extends React.PureComponent<ICreateUserProps, EL.Stateless> {
    render() {
        return <CreateUserForm onSubmit={this.props.submit} />;
    }
}

const createUserValidationRules: EL.IValidationFields = {
    ...basicDetailsValidationRules,
    password: { name: 'Password', required: true }
    passwordConfirmation: { name: 'Password', required: true, sameAs: { fieldName: 'password', fieldDisplayName: 'password' } },
};

@reduxForm({ form: 'create-user-form', validate: values => validate(createUserValidationRules, values) })
class CreateUserForm extends React.PureComponent<ICreateUserFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <BasicDetailsFormFields />

                <InputField name="password" label="Password" type="password" />
                <InputField name="passwordConfirmation" label="Password Confirmation" type="password" />

                <hr />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Create User</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}