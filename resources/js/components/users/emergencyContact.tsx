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
import mapParamsToProps from '../hoc/mapParamsToProps';


interface IViewEmergencyContactProps {
    emergencyContact: EL.Resource<EL.IEmergencyContact>;
    userId: number;
}

interface IEditEmergencyContactProps {
    userId: number;
    submit: (data: React.FormEvent<Form>, emergencyContactId: number, userId: number) => void;
    emergencyContact: EL.Resource<EL.IEmergencyContact>;
}

interface IEditEmergencyContactFormProps {
    onSubmit: (args: any) => void;
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    initialValues: EL.IEmergencyContact;
}

@mapParamsToProps(['userId'])
@UserEmergencyContactHOC()
@PanelHOC<IViewEmergencyContactProps>('Emergency Contact', props => props.emergencyContact)
export class ViewEmergencyContact extends React.PureComponent<IViewEmergencyContactProps> {
    render() {
        const emergencyContact = this.props.emergencyContact.data;

        if (!emergencyContact.name && !emergencyContact.email && !emergencyContact.phone) {
            return (
                <div>
                    <Link to={`/my-profile/organisation/users/${this.props.userId}/emergency-contact/edit`} className="btn btn-sm btn-info pull-right"><Icon iconName="pencil-square-o" />Create</Link>
                    <h3>No Emergency Contact</h3>
                </div>
            );
        }

        return (
            <div>
                <Link to={`/my-profile/organisation/users/${this.props.userId}/emergency-contact/edit`} className="btn btn-sm btn-info pull-right"><Icon iconName="pencil-square-o" />Edit</Link>
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

@mapParamsToProps(['userId'])
@(connect<{}, {}, {userId: number}>(
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
) as any)
@UserEmergencyContactHOC()
@PanelHOC<IEditEmergencyContactProps>('Emergency Contact', props => props.emergencyContact)
export class EditEmergencyContact extends React.PureComponent<IEditEmergencyContactProps> {
    render() {
        return (
            <EmergencyContactForm
                onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.emergencyContact.data.id, this.props.userId)}
                initialValues={this.props.emergencyContact.data || ({} as EL.IEmergencyContact) } />
        );
    }
}

@(reduxForm<{emergencyContact: EL.Resource<EL.IEmergencyContact>}>({
    form: 'emergency-contact-form',
    validate: (values) => validate(emergencyContactValidationRules, values)
}) as any)
class EmergencyContactForm extends React.PureComponent<IEditEmergencyContactFormProps> {
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