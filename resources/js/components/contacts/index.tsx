import * as React from 'react';
import { ContactsHOC, ContactHOC } from '../hoc/resourceHOCs';
import Table from '../dataTable';
import PanelHOC from '../hoc/panelHOC';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';
import { InputField, SelectField } from '../form-fields';
import { reduxForm } from 'redux-form';
import { validate } from '../utils/validation';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Icon from '../icon';
import { connect } from 'react-redux';
import { createNotification, createResource, updateResource, deleteResource, confirmAction } from '../../actions';
import MapParamsToProps from '../hoc/mapParamsToProps';

interface ContactsProps {
    contacts: EL.Resource<EL.Contact[]>;
}

const HEADINGS = ['ID', 'Name', 'Email', 'Phone', 'Actions'];

@ContactsHOC()
@PanelHOC<ContactsProps>('Contacts', props => props.contacts)
export class Contacts extends React.PureComponent<ContactsProps> {
    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Link to="/contacts/create" className="btn btn-default"><Icon iconName="plus" />Create Contact</Link>
                </ButtonToolbar>

                <Table headings={HEADINGS} lastColIsActions>
                    { this.props.contacts.data.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>{contact.name}</td>
                            <td><a href={ 'mailto:' + contact.email }>{contact.email}</a></td>
                            <td>{contact.phone}</td>
                            <td className="actions">
                                <Link to={`/contacts/${contact.id}`}>View</Link>
                            </td>
                        </tr>
                    )) }
                </Table>
            </div>
        );
    }
}

interface ContactProps {
    contact: EL.Resource<EL.Contact>;
    deleteContact: (contactId: number) => void;
}

@(connect(
    undefined,
    {
        deleteContact: (contactId: number) => {
            const deleteAction = deleteResource(`contacts/${contactId}`, {
                onSuccess: [createNotification('Contact deleted.'), (response) => push('/contacts')],
                onFailure: [createNotification('Contact deletion failed. Please try again.', true)],
            });

            return confirmAction({
                title: 'Confirm Delete Contact',
                content: 'Are you sure you want to delete this contact?',
                acceptButtonText: 'Delete',
                declineButtonText: 'Cancel',
                onAccept: deleteAction
            });
        }
    }
) as any)
@MapParamsToProps(['contactId'])
@ContactHOC()
@PanelHOC<ContactProps>('Contact', props => props.contact)
export class Contact extends React.PureComponent<ContactProps> {
    render() {
        const contact = this.props.contact.data;

        return (
            <div>
                <ButtonToolbar className="pull-right">
                    <Link to={`/contacts/${contact.id}/edit`} className="btn btn-sm btn-default"><Icon iconName="pencil-square-o" />Edit</Link>
                    <Link to={`/contacts/${contact.id}/addresses`} className="btn btn-sm btn-default"><Icon iconName="pencil-square-o" />Addresses</Link>
                    <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteContact(contact.id)}><Icon iconName="trash" />Delete</Button>
                </ButtonToolbar>

                <h3>{contact.name}</h3>
                <h4>{contact.type}</h4>

                <dl>
                    <dt>Email</dt>
                    <dd>{contact.email}</dd>

                    <dt>Phone</dt>
                    <dd>{contact.phone}</dd>
                </dl>
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
                <SelectField name="type" label="Type" options={[{value: EL.Constants.INDIVIDUAL, text: 'Individual'}, {value: EL.Constants.ORGANISATION, text: 'Organistion'}]} required />
                <InputField name="name" label="Name" type="text" required />
                <InputField name="firstName" label="First Name" type="text" />
                <InputField name="middleName" label="Middle Name" type="text" />
                <InputField name="surname" label="Surname" type="text" />
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
    form: EL.FormNames.CREATE_CONTACT_FORM,
    validate: values => validate(contactValidationRules, values)
})(ContactForm as any) as any);

const EditContactForm = (reduxForm({
    form: EL.FormNames.EDIT_CONTACT_FORM,
    validate: values => validate(contactValidationRules, values)
})(ContactForm as any) as any);

@(connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>) => {
            const url = 'contacts';
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Contact created.'), (response) => push(`/contacts/${response.contactId}`)],
                onFailure: [createNotification('Contact creation failed. Please try again.', true)],
            };

            return createResource(url, data, meta)
        }
    }
) as any)
@PanelHOC<CreateContactProps>('Create Contact')
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
@PanelHOC<UnwrappedEditContactProps>('Edit Contact', props => props.contact)
class UnwrappedEditContact extends React.PureComponent<UnwrappedEditContactProps> {
    render() {
        return <EditContactForm initialValues={this.props.contact.data} onSubmit={data => this.props.submit(this.props.contactId, data)} saveButtonText="Save Contact" />
    }
}