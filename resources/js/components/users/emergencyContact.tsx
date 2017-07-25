import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { InputField } from '../form-fields';
import { reduxForm } from 'redux-form';
import { connect, Dispatch } from 'react-redux';
import { UserEmergencyContactHOC } from '../hoc/resourceHOCs';
import PanelHOC from '../hoc/panelHOC';
import { updateResource, createNotification } from '../../actions';
import { validate } from '../utils/validation';
import { EmergencyContactFormFields, emergencyContactValidationRules } from '../users/formFields';
import { Link } from 'react-router';
import Icon from '../icon';
import { push } from 'react-router-redux';


interface IViewEmergencyContactProps {
    params: {
        userId: number;
    };
}
interface IViewEmergencyContactContentProps {
    emergencyContact: EL.Resource<EL.IEmergencyContact>;
    userId: number;
}

interface IEditEmergencyContactProps {
    params: {
        userId: number;
    };
}

interface IEditEmergencyContactContentsProps {
    userId: number;
    submit: (data: React.FormEvent<Form>) => void;
    emergencyContact: EL.Resource<EL.IEmergencyContact>;
}

interface IEditEmergencyContactFormProps {
    handleSubmit: (data: React.FormEvent<Form>) => void;
    initialValues: EL.IEmergencyContact;
}

export class ViewEmergencyContact extends React.PureComponent<IViewEmergencyContactProps> {
    render() {
        return <ViewEmergencyContactContents userId={this.props.params.userId} />
    }
}

@UserEmergencyContactHOC()
@PanelHOC('Emergency Contact', [props => props.emergencyContact])
class ViewEmergencyContactContents extends React.PureComponent<IViewEmergencyContactContentProps> {
    render() {
        const emergencyContact = this.props.emergencyContact.data;

        return (
            <div>
                <Link to={`/users/${this.props.userId}/emergency-contact/edit`} className="btn btn-sm btn-info pull-right"><Icon iconName="pencil-square-o" />&nbsp;&nbsp;Edit</Link>
                <h3>{emergencyContact.name}</h3>

                <dl>
                    <dt>Email</dt>
                    <dd>{emergencyContact.email}</dd>

                    <dt>Phone</dt>
                    <dd>{emergencyContact.phone}</dd>
                </dl>
            </div>
        );
    }
}

export class EditEmergencyContact extends React.PureComponent<IEditEmergencyContactProps, EL.Stateless> {
    render() {
        return <EditEmergencyContactContents userId={this.props.params.userId} />
    }
}

@connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>, emergencyContactId: number, userId: number) => {
            const url = `emergency-contact/${emergencyContactId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Emergency contact updated.'), push(`/users/${userId}/emergency-contact`)],
                onFailure: [createNotification('Emergency contact update failed.', true)]
            };

            return updateResource(url, data, meta);
        }
    }
)
@UserEmergencyContactHOC()
@PanelHOC('Emergency Contact', [props => props.emergencyContact])
class EditEmergencyContactContents extends React.PureComponent<IEditEmergencyContactContentsProps, EL.Stateless> {
    render() {
        return (
            <EmergencyContactForm
                onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.emergencyContact.data.id, this.props.userId)}
                initialValues={this.props.emergencyContact.data} />
        );
    }
}

@reduxForm({ form: 'emergency-contact-form', validate: (values) => validate(emergencyContactValidationRules, values) })
class EmergencyContactForm extends React.PureComponent<IEditEmergencyContactFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <EmergencyContactFormFields />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Save</Button>
                </ButtonToolbar>
            </Form>
        )
    }
}