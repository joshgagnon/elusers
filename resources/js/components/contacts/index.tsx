import * as React from 'react';
import { ContactsHOC, ContactHOC } from '../hoc/resourceHOCs';
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
import { createNotification, createResource, updateResource, deleteResource } from '../../actions';

interface ContactsProps {
    contacts: EL.Resource<EL.Contact[]>;
    deleteContact: (contactId: number) => void;
}

const HEADINGS = ['ID', 'Name', 'Email', 'Phone', 'Actions'];

@(connect(
    undefined,
    {
        deleteContact: (contactId: number) => deleteResource(`contacts/${contactId}`)
    }
) as any)
@ContactsHOC()
@(PanelHOC('Contacts', [(props: ContactsProps) => props.contacts]) as any)
export class Contacts extends React.PureComponent<ContactsProps> {
    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Link to="/contacts/create" className="btn btn-default"><Icon iconName="plus" />&nbsp;&nbsp;Create Contact</Link>
                </ButtonToolbar>

                <Table headings={HEADINGS} lastColIsActions>
                    { this.props.contacts.data.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>{contact.name}</td>
                            <td><a href={ 'mailto:' + contact.email }>{contact.email}</a></td>
                            <td>{contact.phone}</td>
                            <td>
                                <ButtonToolbar>
                                    <Link to={`/contacts/${contact.id}/edit`} className="btn btn-default btn-sm">Edit</Link>
                                    <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteContact(contact.id)}>Delete</Button>
                                </ButtonToolbar>
                            </td>
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
                <InputField name="name" label="Name" type="text" required />
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
    email: { name: 'Email' },
    phone: { name: 'Phone' },
}

const CreateContactForm = (reduxForm({
    form: 'create-contact-form',
    validate: values => validate(contactValidationRules, values)
})(ContactForm) as any);

const EditContactForm = (reduxForm({
    form: 'edit-contact-form',
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

export class EditContact extends React.PureComponent<{ params: { contactId: number; } }> {
    render() {
        return <UnwrappedEditContact contactId={this.props.params.contactId} />
    }
}

interface UnwrappedEditContactProps {
    submit?: (contactId: number, data: React.FormEvent<Form>) => void;
    contactId: number;
    contact?: EL.Resource<EL.Contact>;
}

@(connect(
    undefined,
    {
        submit: (contactId: number, data: React.FormEvent<Form>) => {
            const url = `contacts/${contactId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Contact updated.'), (response) => push('/contacts')],
                onFailure: [createNotification('Contact update failed. Please try again.', true)],
            };

            return updateResource(url, data, meta);
        }
    }
) as any)
@ContactHOC()
@PanelHOC('Edit Contact', [(props: UnwrappedEditContactProps) => props.contact])
class UnwrappedEditContact extends React.PureComponent<UnwrappedEditContactProps> {
    render() {
        return <EditContactForm initialValues={this.props.contact.data} onSubmit={data => this.props.submit(this.props.contactId, data)} saveButtonText="Save Contact" />
    }
}