import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { InputField } from '../form-fields';
import { reduxForm, reset } from 'redux-form';
import { connect, Dispatch } from 'react-redux';
import PanelHOC from '../hoc/panelHOC';
import { updateResource, createNotification } from '../../actions';
import { validate } from '../utils/validation';

interface IChangePasswordProps {
    user: EL.User;
    submit: (data: React.FormEvent<Form>, user: EL.User) => void;
}

interface IChangePasswordFormProps {
    handleSubmit: (data: React.FormEvent<Form>) => void;
}

function mapStateToProps(state: EL.State) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        submit: (data: React.FormEvent<Form>, user: EL.User) => {
            const url = `users/${user.id}/password`;
            const meta: EL.Actions.Meta = {
                onSuccess: [reset('change-password-form'), createNotification('Password changed.')],
                onFailure: [reset('change-password-form'), createNotification('Password change failed. Please try again.', true)]
            };

            dispatch(updateResource(url, data, meta));
        }
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@PanelHOC('Change Password')
export default class ChangePassword extends React.PureComponent<IChangePasswordProps, EL.Stateless> {
    render() {
        return (
            <ChangePasswordForm onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.user)} />
        );
    }
}


const validationRules: EL.IValidationFields = {
    currentPassword:  { name: 'Current password',  required: true, maxLength: 255 },
    newPassword: { name: 'New password', required: true, maxLength: 255 },
    newPasswordConfirmation: { name: 'New password confirmation', required: true, maxLength: 255 }
};

@reduxForm({ form: 'change-password-form', validate: (values) => validate(validationRules, values) })
class ChangePasswordForm extends React.PureComponent<IChangePasswordFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit}  horizontal>
                <InputField name="currentPassword" label="Current Password" type="password" />
                <InputField name="newPassword" label="New Password" type="password" />
                <InputField name="newPasswordConfirmation" label="New Password Confirmation" type="password" />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Change Password</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}