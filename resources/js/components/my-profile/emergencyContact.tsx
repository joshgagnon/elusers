import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { InputField } from '../form-fields';
import { reduxForm } from 'redux-form';
import { connect, Dispatch } from 'react-redux';
import { UserEmergencyContactHOC } from '../hoc/resourceHOCs';
import CardHOC from '../hoc/CardHOC';
import { updateResource } from '../../actions';
import { validate } from '../utils/validation';
import { EmergencyContactFormFields, emergencyContactValidationRules } from '../users/formFields';

interface IEmergencyContactProps {
    user: EL.User;
    submit: (data: React.FormEvent<typeof Form>, emergencyContact: EL.IEmergencyContact) => void;
    emergencyContact: EL.Resource<EL.IEmergencyContact>;
}

interface IEmergencyContactFormProps {
    handleSubmit?: (data: React.FormEvent<typeof Form>) => void;
    onSubmit: (data: React.FormEvent<typeof Form>) => void;
    initialValues: EL.IEmergencyContact;
}

function mapStateToProps(state: EL.State) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        submit: (data: React.FormEvent<typeof Form>, emergencyContact: EL.IEmergencyContact) => {
            const url = `emergency-contact/${emergencyContact.id}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [ ] // TODO: add notification here
            };

            dispatch(updateResource(url, data, meta));
        }
    };
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
@UserEmergencyContactHOC()
@CardHOC<IEmergencyContactProps>('Emergency Contact', props => props.emergencyContact)
export default class EmergencyContact extends React.PureComponent<IEmergencyContactProps> {
    render() {
        return (
            <EmergencyContactForm onSubmit={(data: React.FormEvent<typeof Form>) => this.props.submit(data, this.props.emergencyContact.data)} initialValues={this.props.emergencyContact.data} />
        );
    }
}

@(reduxForm({ form: 'emergency-contact-form', validate: (values) => validate(emergencyContactValidationRules, values) }) as any)
class EmergencyContactForm extends React.PureComponent<IEmergencyContactFormProps> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <EmergencyContactFormFields />

                <React.Fragment>
                    <Button variant="primary" className="pull-right" type="submit">Save</Button>
                </React.Fragment>
            </Form>
        )
    }
}