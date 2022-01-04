import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import CardHOC from '../hoc/CardHOC';
import { connect, Dispatch } from 'react-redux';
import { validate } from '../utils/validation';
import { updateResource, createNotification } from '../../actions';
import { BasicDetailsFormFields, basicDetailsValidationRules } from '../users/formFields';

interface IBasicDetailsProps {
    submit: (event: React.FormEvent<typeof Form>, user: EL.User) => void;
    user: EL.User;
}

interface IBasicDetailsFormProps {
    handleSubmit?: (data: React.FormEvent<typeof Form>) => void;
    onSubmit: (data: React.FormEvent<typeof Form>) => void;
    initialValues: EL.User;
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        submit: (event: React.FormEvent<typeof Form>, user: EL.User) => {
            const url = `users/${user.id}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Basic details updated.')],
                onFailure: [createNotification('Basic details update failed. Please try again.', true)]
            };

            dispatch(updateResource(url, event, meta));
        }
    };
}

@(connect((state: EL.State) => ({ user: state.user }), mapDispatchToProps) as any)
@CardHOC<IBasicDetailsProps>('Basic Details')
export default class BasicDetails extends React.PureComponent<IBasicDetailsProps> {
    render() {
        return (
            <BasicDetailsForm onSubmit={(event: React.FormEvent<typeof Form>) => this.props.submit(event, this.props.user)} initialValues={this.props.user} />
        );
    }
}

@(reduxForm({ form: 'user-form', validate: values => validate(basicDetailsValidationRules, values) }) as any)
class BasicDetailsForm extends React.PureComponent<IBasicDetailsFormProps> {
    render() {
        return (
            <Form onSubmit={ this.props.handleSubmit } horizontal>
                <BasicDetailsFormFields />

                <React.Fragment>
                    <Button variant="primary" className="pull-right" type="submit">Save</Button>
                </React.Fragment>
            </Form>
        );
    }
}