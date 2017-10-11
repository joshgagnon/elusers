import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { InputField } from '../form-fields';
import { reduxForm, reset } from 'redux-form';
import { connect, Dispatch } from 'react-redux';
import PanelHOC from '../hoc/panelHOC';
import { updateResource, createNotification } from '../../actions';
import { validate } from '../utils/validation';
import mapParamsToProps from '../hoc/mapParamsToProps';

interface IChangePasswordProps {
    userId: number;
    submit: (data: React.FormEvent<Form>, userId: number) => void;
}

interface IChangePasswordFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit?: (data: React.FormEvent<Form>) => void;
}

@mapParamsToProps(['userId'])
@(connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>, userId: number) => {
            const url = `users/${userId}/password`;
            const meta: EL.Actions.Meta = {
                onSuccess: [reset('change-password-form'), createNotification('Password changed.')],
                onFailure: [reset('change-password-form'), createNotification('Password change failed. Please try again.', true)]
            };

            return updateResource(url, data, meta);
        }
    }
) as any)
@PanelHOC<IChangePasswordProps>('Change Password')
export class ChangePassword extends React.PureComponent<IChangePasswordProps, EL.Stateless> {
    render() {
        return <ChangePasswordForm onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.userId)} />;
    }
}


const validationRules: EL.IValidationFields = {
    currentPassword:  { name: 'Current password',  required: true, maxLength: 255 },
    newPassword: { name: 'New password', required: true, maxLength: 255 },
    newPasswordConfirmation: { name: 'New password confirmation', required: true, maxLength: 255 }
};

@(reduxForm({ form: 'change-password-form', validate: (values) => validate(validationRules, values) }) as any)
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