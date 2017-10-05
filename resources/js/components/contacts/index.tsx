import * as React from 'react';
import { ContactsHOC } from '../hoc/resourceHOCs';
import Table from '../dataTable';
import PanelHOC from '../hoc/panelHOC';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';
import { InputField } from '../form-fields';
import { reduxForm } from 'redux-form';
import { validate } from '../utils/validation';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Icon from '../icon';
import { connect } from 'react-redux';
import { createNotification, createResource } from '../../actions';

interface ContactsProps {
    contacts: EL.Resource<EL.Contact[]>;
}

const HEADINGS = ['ID', 'Name', 'Email', 'Phone'];

@ContactsHOC()
@(PanelHOC('Contacts', [(props: ContactsProps) => props.contacts]) as any)
export class Contacts extends React.PureComponent<ContactsProps> {
    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Link to="/contacts/create" className="btn btn-default"><Icon iconName="plus" />&nbsp;&nbsp;Create Contact</Link>
                </ButtonToolbar>

                <Table headings={HEADINGS}>
                    { this.props.contacts.data.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>{contact.name}</td>
                            <td><a href={ 'mailto:' + contact.email }>{contact.email}</a></td>
                            <td>{contact.phone}</td>
                        </tr>
                    )) }
                </Table>
            </div>
        );
    }
}

interface ContactFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    saveButtonText: string;
}

interface CreateContactProps {
    submit: (data: React.FormEvent<Form>) => void;
}

class ContactForm extends React.PureComponent<ContactFormProps> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <InputField name="name" label="Name" type="text" />
                <InputField name="email" label="Email" type="email" />
                <InputField name="phone" label="Phone" type="text" />

                <hr />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">{this.props.saveButtonText}</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}

const contactValidationRules: EL.IValidationFields = {
    name: { name: 'Name', required: true },
    email: { name: 'Email', required: true },
    phone: { name: 'Phone', required: true },
}

const CreateContactForm = (reduxForm({
    form: 'create-deed-packet-form',
    validate: values => validate(contactValidationRules, values)
})(ContactForm) as any);

@(connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>) => {
            const url = 'contacts';
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Contact created.'), (response) => push('/contacts')],
                onFailure: [createNotification('Contact creation failed. Please try again.', true)],
            };

            return createResource(url, data, meta)
        }
    }
) as any)
@PanelHOC('Create Contact')
export class CreateContact extends React.PureComponent<CreateContactProps> {
    render() {
        return <CreateContactForm onSubmit={this.props.submit} saveButtonText="Create Contact" />
    }
}