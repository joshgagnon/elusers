import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { InputField } from '../form-fields';
import { reduxForm } from 'redux-form';
import { connect, Dispatch } from 'react-redux';
import { UserEmergencyContactHOC } from '../hoc/resourceHOCs';
import PanelHOC from '../hoc/panelHOC';
import { updateResource } from '../../actions';
import { validate } from '../utils/validation';
import { EmergencyContactFormFields, emergencyContactValidationRules } from '../users/formFields';

interface IEditEmergencyContactProps {
    user: EL.User;
    submit: (data: React.FormEvent<Form>) => void;
    emergencyContact: EL.Resource<EL.IEmergencyContact>;
}

interface IEditEmergencyContactFormProps {
    handleSubmit: (data: React.FormEvent<Form>) => void;
    initialValues: EL.IEmergencyContact;
}

export class ViewEmergencyContact extends React.PureComponent<IViewEmergencyContactProps, EL.Stateless> {
    render() {
        const { emergencyContact } = this.props;

        return (
            <div>
                <h3>{emergencyContact.name}</h3>
            </div>
        );
    }
} 

@connect(
    (state: EL.State) => ({
        user: state.user
    }),
    {
        submit: (data: React.FormEvent<Form>, emergencyContact: EL.IEmergencyContact) => {
            const url = `emergency-contact/${emergencyContact.id}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [ ] // TODO: add notification here
            };

            return updateResource(url, data, meta);
        }
    }
)
@UserEmergencyContactHOC()
@PanelHOC('Emergency Contact', [props => props.emergencyContact])
export class EditEmergencyContact extends React.PureComponent<IEditEmergencyContactProps, EL.Stateless> {
    render() {
        return (
            <EmergencyContactForm onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.emergencyContact.data)} initialValues={this.props.emergencyContact.data} />
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