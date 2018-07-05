import * as React from 'react';
import { ContactsHOC, ContactHOC } from '../hoc/resourceHOCs';
import Table from '../dataTable';
import PanelHOC from '../hoc/panelHOC';
import { Form, ButtonToolbar, Button, ProgressBar, Alert } from 'react-bootstrap';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField } from '../form-fields';
import ReadOnlyComponent from '../form-fields/readOnlyComponent';
import { reduxForm, formValueSelector } from 'redux-form';
import { validate } from '../utils/validation';
import { fullname } from '../utils';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Icon from '../icon';
import { connect } from 'react-redux';
import { createNotification, createResource, updateResource, deleteResource, confirmAction, showAMLCFTToken  } from '../../actions';
import MapParamsToProps from '../hoc/mapParamsToProps';
import { AddressFields } from '../address/form';
import { ContactCapacity } from './amlcft';


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
    contactId: string;
    deleteContact: (contactId: number) => void;
    requestAMLCFT: (contactId: number) => void;
}

@ContactHOC()
export class Agent extends React.PureComponent<{contact?: EL.Resource<EL.Contact>; contactId: string; }> {
    render() {
        if(this.props.contact.data) {
            const contact = this.props.contact.data;
            return fullname(this.props.contact.data);
        }
        return false;
    }

}


const IndividualDisplayFields = (props: {contact: EL.Contact}) => {
    const { contact } = props;
    return <React.Fragment>
    <dt>Date of Birth</dt>
    <dd>{ contact.dateOfBirth }</dd>
    <dt>Capacity</dt>
    <dd>{ contact.capacity }</dd>
    </React.Fragment>
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
        },
        requestAMLCFT: (contactId: number) => {
            const createAction = createResource(`contacts/${contactId}/access_token`, {}, {
                onSuccess: [createNotification('Contact AML/CFT request send.'), (response) => {
                    return showAMLCFTToken({contactId, token: response.token});
                }],
                onFailure: [createNotification('Contact AML/CFT request failed. Please try again.', true)],
            });

            return confirmAction({
                title: 'Confirm Send AML/CFT Request to Contact',
                content: 'Are you sure you want send a AML/CFT to this contact?',
                acceptButtonText: 'Send',
                declineButtonText: 'Cancel',
                onAccept: createAction
            });
        },

    }
) as any)
@MapParamsToProps(['contactId'])
@ContactHOC()
@PanelHOC<ContactProps>('Contact', props => props.contact)
export class Contact extends React.PureComponent<ContactProps> {

    render() {
        const contact = this.props.contact.data;
        const individual = contact.type === EL.Constants.INDIVIDUAL;
        const hasSubmitted = !!contact.accessTokens.length && contact.accessTokens[0].submitted;
        return (
            <div>
                <ButtonToolbar className="pull-right">
                    <Link to={`/contacts/${contact.id}/edit`} className="btn btn-sm btn-default"><Icon iconName="pencil-square-o" />Edit</Link>
                    <Link to={`/contacts/${contact.id}/addresses`} className="btn btn-sm btn-default"><Icon iconName="pencil-square-o" />Addresses</Link>
                    <Button bsStyle="info" bsSize="sm" onClick={() => this.props.requestAMLCFT(contact.id)}><Icon iconName="pencil-square-o" />Get AML/CFT Token</Button>
                    <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteContact(contact.id)}><Icon iconName="trash" />Delete</Button>
                </ButtonToolbar>

                <h3>{fullname(contact)}</h3>
                <h4>{contact.type}</h4>

                <dl>
                    <dt>Email</dt>
                    <dd>{contact.email}</dd>

                    <dt>Phone</dt>
                    <dd>{contact.phone}</dd>
                    <dt>Agent</dt>

                    <dd><Agent contactId={contact.agentId} /></dd>
                    { individual  && <IndividualDisplayFields contact={contact} /> }
                    <dt>AML/CFT Complete</dt>

                    <dd>{ contact.amlcftComplete ? 'Yes' : 'No'}</dd>
                    <dt>Documents</dt>
                    <dd>{ (contact.files || []).map((file, i) => {
                        return <div key={file.id}><a target="_blank" href={`/api/files/${file.id}`}>{file.filename}</a></div>
                    }) } </dd>

                </dl>
                { hasSubmitted && <Alert  bsStyle="success">
                <p className="text-center">
                This contact has submitted their AML/CFT information. <Link className="btn btn-success" to={`/contacts/${contact.id}/merge`}>View</Link>
                </p>
                </Alert> }
            </div>
        );
    }
}

@ContactsHOC()
class AgentSelector extends React.PureComponent<{contacts?: EL.Resource<EL.Contact[]>;}> {
    render() {
        if(!this.props.contacts.data){
            return false;
        }
        const name = contact => {
            if(!contact){
                return 'None';
            }
           const title = contact.type === EL.Constants.INDIVIDUAL ? `${contact.firstName} ${contact.surname}` : contact.name;
           return title;
       };
        return <DropdownListField name="agentId" label="Agent" data={[{}, ...this.props.contacts.data]} textField={name} valueField='id' />
    }
}




class ContactName extends React.PureComponent<{'type':string; 'firstName':string; 'middleName':string; 'surname':string;}> {
    render() {
        if(this.props.type === EL.Constants.INDIVIDUAL){
            return <div>
                    <ReadOnlyComponent label="Full Name" value={fullname(this.props as EL.Contact)} />

                    <InputField name="firstName" label="First Name" type="text" required/>
                    <InputField name="middleName" label="Middle Name" type="text" />
                    <InputField name="surname" label="Surname" type="text" required />
            </div>
        }
        return <InputField name="name" label="Name" type="text" required />

    }
}
const ConnectedContactName = connect<{}, {}, {selector: (state: any, ...args) => any}>((state: EL.State, props: {selector: (state: any, ...args) => any}) => {
    return props.selector(state, 'type', 'firstName', 'middleName', 'surname');
})(ContactName as any);


class IndividualFields extends React.PureComponent<{'type':string}> {
    render() {
        if(this.props.type === EL.Constants.INDIVIDUAL){
            return <React.Fragment>
                    <DatePicker name="dateOfBirth" label="Date of Birth" defaultView="year"/>
                    <ContactCapacity required={false}/>
            </React.Fragment>
        }
        return false;

    }
}
const ConnectedIndividualFields = connect<{}, {}, {selector: (state: any, ...args) => any}>((state: EL.State, props: {selector: (state: any, ...args) => any}) => {
    return {type: props.selector(state, 'type')};
})(IndividualFields as any);

interface ContactFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    saveButtonText: string;
    form: string;
}

interface CreateContactProps {
    submit: (data: React.FormEvent<Form>) => void;
}


class ContactForm extends React.PureComponent<ContactFormProps> {

    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <SelectField name="type" label="Type" options={[{value: EL.Constants.INDIVIDUAL, text: 'Individual'}, {value: EL.Constants.ORGANISATION, text: 'Organisation'}]} required />

                <ConnectedContactName selector={formValueSelector(this.props.form)} />

                <InputField name="email" label="Email" type="email" />
                <InputField name="phone" label="Phone" type="text" />
                <ConnectedIndividualFields selector={formValueSelector(this.props.form)} />
                <AgentSelector />
                <DocumentList name="files" label="Documents" />
                <CheckboxField name="amlcftComplete" label="AML/CFT Complete" />
                <hr />

                <ButtonToolbar>
                    { /*<Link className="btn btn-default pull-right" to="/contacts">Back</Link> */ }
                    <Button bsStyle="primary" className="pull-right" type="submit">Submit</Button>
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
                onSuccess: [createNotification('Contact updated.'), (response) => push(`/contacts/${contactId}`)],
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


export class EditContact extends React.PureComponent<{ params: { contactId: number; } }> {
    render() {
        return <UnwrappedEditContact contactId={this.props.params.contactId} />
    }
}

