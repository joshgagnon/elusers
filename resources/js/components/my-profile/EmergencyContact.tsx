import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { InputField } from '../form-fields';
import { reduxForm } from 'redux-form';
import { connect, Dispatch } from 'react-redux';
import { UserEmergencyContactHOC } from '../hoc/resourceHOCs';
import PanelHOC from '../hoc/panelHOC';
import { updateResource } from '../../actions';
import { validate } from '../utils/validation';

interface IEmergencyContactProps {
    user: EL.User;
    submit: (data: React.FormEvent<Form>) => void;
    emergencyContact: EL.Resource<EL.IEmergencyContact>;
}

interface IEmergencyContactFormProps {
    handleSubmit: (data: React.FormEvent<Form>) => void;
    initialValues: EL.IEmergencyContact;
}

function mapStateToProps(state: EL.State) {
    return {
        user: state.user;
    };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        submit: (data: React.FormEvent<Form>, emergencyContact: EL.EmergencyContact) => {
            const url = `emergency-contact/${emergencyContact.id}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [ ] // TODO: add notification here
            };

            dispatch(updateResource(url, data, meta));
        }
    };
}

@connect(mapStateToProps, mapDispatchToProps)
@UserEmergencyContactHOC()
@PanelHOC('Emergency Contact', [props => props.emergencyContact])
export default class EmergencyContact extends React.PureComponent<IEmergencyContactProps, EL.Stateless> {
    render() {
        return (
            <EmergencyContactForm onSubmit={(data) => this.props.submit(data, this.props.emergencyContact.data)} initialValues={this.props.emergencyContact.data} />
        );
    }
}


const validationRules = {
    name:  { name: 'Name',  required: true, maxLength: 255 },
    email: { name: 'Email', required: true, maxLength: 255 },
    phone: { name: 'Phone', required: true, maxLength: 255, isPhoneNumber: true }
};

@reduxForm({ form: 'emergency-contact-form', validate: (values) => validate(validationRules, values) })
class EmergencyContactForm extends React.PureComponent<IEmergencyContactFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit}  horizontal>
                <InputField name="name" label="Name" type="text" />
                <InputField name="email" label="Email" type="email" />
                <InputField name="phone" label="Phone" type="text" />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Save</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}