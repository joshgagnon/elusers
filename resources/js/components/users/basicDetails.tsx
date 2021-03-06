import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import PanelHOC from '../hoc/panelHOC';
import { connect, Dispatch } from 'react-redux';
import { validate } from '../utils/validation';
import { updateResource, createNotification } from '../../actions';
import { BasicDetailsFormFields, basicDetailsValidationRules } from './formFields';
import { fullname } from '../utils';
import { push } from 'react-router-redux';
import Table from '../dataTable';
import { Link } from 'react-router';
import Icon from '../icon';
import { formatDate } from '../utils';
import { UserHOC } from '../hoc/resourceHOCs';

interface IViewBasicDetailsProps {
    params: {
        userId: number;
    };
}

interface IEditBasicDetailsProps {
    user?: EL.Resource<EL.User>;
    userId: number
    submit?: (event: React.FormEvent<Form>, userId: number) => void;
}

interface IViewBasicDetailsContentsProps {
    user?: EL.Resource<EL.User>;
    userId: number
}

interface IEditBasicDetailsFormProps {
    onSubmit?: (event: React.FormEvent<Form>) => void;
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    initialValues: any
}

export class ViewBasicDetails extends React.PureComponent<IViewBasicDetailsProps> {
    render() {
        return (
            <ViewBasicDetailsContents userId={this.props.params.userId} />
        );
    }
}

@UserHOC()
@PanelHOC<IViewBasicDetailsContentsProps>('Basic Details', props => props.user)
export class ViewBasicDetailsContents extends React.PureComponent<IViewBasicDetailsContentsProps> {
    render() {
        const user = this.props.user.data;

        return (
            <div>
                <Link to={`/my-profile/organisation/users/${user.id}/edit`} className="btn btn-sm btn-info pull-right"><Icon iconName="pencil-square-o" />Edit</Link>
                <h3>{fullname(user)} { user.preferredName ? `(${user.preferredName})` : '' }</h3>

                <dl>
                    <dt>Email</dt>
                    <dd>{user.email}</dd>

                    <dt>Is Lawyer</dt>
                    <dd>{user.lawAdmissionDate ? 'Yes, admission date: ' + formatDate(user.lawAdmissionDate) : 'Not a lawyer'}</dd>

                    {user.irdNumber && <dt>IRD Number</dt> }
                    {user.irdNumber && <dd>{user.irdNumber}</dd> }

                    {user.bankAccountNumber && <dt>Bank Account Number</dt>}
                    {user.bankAccountNumber && <dd>{user.bankAccountNumber}</dd>}
                </dl>
            </div>
        );
    }
}

export class EditBasicDetails extends React.PureComponent<{params: {userId: number}}> {
    render() {
        return <EditBasicDetailsContents userId={this.props.params.userId} />;
    }
}

@(connect(
    undefined,
    {
        submit: (event: React.FormEvent<Form>, userId: number) => {
            const url = `users/${userId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Basic details updated.'), push(`/users/${userId}`)],
                onFailure: [createNotification('Basic details update failed. Please try again.', true)]
            };

            return updateResource(url, event, meta);
        }
    }
) as any)
@UserHOC()
@PanelHOC<IEditBasicDetailsProps>('Basic Details', props => props.user)
class EditBasicDetailsContents extends React.PureComponent<IEditBasicDetailsProps> {
    render() {
        return (
            <BasicDetailsForm onSubmit={(event: React.FormEvent<Form>) => this.props.submit(event, this.props.userId)} initialValues={this.props.user.data} />
        );
    }
}

@(reduxForm({ form: 'user-form', validate: values => validate(basicDetailsValidationRules, values) }) as any)
class BasicDetailsForm extends React.PureComponent<IEditBasicDetailsFormProps> {
    render() {
        return (
            <Form onSubmit={ this.props.handleSubmit } horizontal>
                <BasicDetailsFormFields />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Save</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}