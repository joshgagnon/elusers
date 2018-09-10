import * as React from 'react';
import { ContactsHOC, ContactHOC } from '../hoc/resourceHOCs';
import Table from '../dataTable';
import PanelHOC from '../hoc/panelHOC';
import { Form, ButtonToolbar, Button, ProgressBar, Alert, FormControl } from 'react-bootstrap';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';
import ReadOnlyComponent from '../form-fields/readOnlyComponent';
import { reduxForm, formValueSelector } from 'redux-form';
import { validate } from '../utils/validation';
import { fullname } from '../utils';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Icon from '../icon';
import { connect } from 'react-redux';
import { createNotification, createResource, updateResource, deleteResource, confirmAction, showAMLCFTToken, showUploadModal  } from '../../actions';
import MapParamsToProps from '../hoc/mapParamsToProps';
import { AddressFields } from '../address/form';
import { ContactCapacity } from './amlcft';
import { Relationships } from './relationships';
import { ContactSelector } from './contactSelector';
import * as ReactList from 'react-list';

interface ContactsProps {
    contacts: EL.Resource<EL.Contact[]>;
    showUploadModal: () => void;
}

const HEADINGS = ['Name', 'Type', 'Email', 'Phone', 'Actions'];


interface ContactState {
    searchValue: string;
}

const FormHeading = (props: {title: string}) => <h4 className="text-center">{ props.title }</h4>


function filterData(search: string, data: EL.Contact[]) {
    if(search){
        return data.filter(contact => fullname(contact).toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    }
    data.sort((a, b) => fullname(a).localeCompare(fullname(b)));
    return data;
}

@ContactsHOC()
@(PanelHOC<ContactsProps>('Contacts', props => props.contacts) as any)
@(connect(undefined, {
    showUploadModal: () => showUploadModal({})
}) as any)
export class Contacts extends React.PureComponent<ContactsProps, ContactState> {

    state = {
        searchValue: ''
    }

    render() {
        const data = filterData(this.state.searchValue, this.props.contacts.data);
        return (
            <div>
                <ButtonToolbar>
                    <Link to="/contacts/create" className="btn btn-primary"><Icon iconName="plus" />Create Contact</Link>
                    <Button onClick={this.props.showUploadModal}><Icon iconName="plus" />Upload Contact List</Button>
                </ButtonToolbar>

                <div className="search-bar">
                    <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={(e: any) => this.setState({searchValue: e.target.value})} />
                </div>
                <div className="lazy-table">
                    <ReactList
                        type='variable' // remove if use widths for cells
                        useStaticSize={true}
                        threshold={200}
                        itemRenderer={(index) => {
                            const contact = data[index]; //cause the header
                            if(!contact){
                                return false;
                            }
                            return <tr key={contact.id}>
                            <td>{fullname(contact)}</td>
                            <td>{contact.contactableType}</td>
                            <td><a href={ 'mailto:' + contact.email }>{contact.email}</a></td>
                            <td>{contact.phone}</td>
                            <td className="actions">
                                <Link to={`/contacts/${contact.id}`}>View</Link>
                            </td>
                        </tr>}}
                        itemsRenderer={(items, ref) => {
                            return <Table headings={HEADINGS} lastColIsActions bodyRef={ref}>
                                { items }
                            </Table>
                        }}
                        length={data.length+1} // for the header
                      />
                      </div>
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


const IndividualDisplayFields = (props: {contact: EL.ContactIndividual}) => {
    const { contact } = props;
    return <React.Fragment>
     { contact.title && <dt>Title</dt> }
    { contact.title && <dd>{ contact.title}</dd> }
    { contact.preferredName && <dt>Preferred Name</dt> }
    { contact.preferredName && <dd>{ contact.preferredName }</dd> }
    { contact.dateOfBirth && <dt>Date of Birth</dt> }
    { contact.dateOfBirth && <dd>{ contact.dateOfBirth }</dd> }
    { contact.dateOfDeath && <dt>Date of Death</dt> }
    { contact.dateOfDeath && <dd>{ contact.dateOfDeath }</dd> }
    { contact.occupation && <dt>Occupation</dt> }
    { contact.occupation && <dd>{ contact.occupation }</dd> }
    { contact.countryOfCitizenship  && <dt>Country of Citizenship</dt> }
    { contact.countryOfCitizenship  && <dd>{ contact.countryOfCitizenship }</dd> }
    { contact.maritalStatus && <dt>Marital Status</dt> }
    { contact.maritalStatus && <dd>{ contact.maritalStatus }</dd> }

    </React.Fragment>
}

const TrustDisplayFields = (props: {contact: EL.ContactTrust}) => {
    const { contact } = props;
    return <React.Fragment>
     <dt>Type</dt>
    <dd>{ contact.trustType}</dd>

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
                content: 'Are you sure you want generate a AML/CFT access token for this contact?',
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
        const individual = contact.contactableType === EL.Constants.INDIVIDUAL;
        const trust = contact.contactableType === EL.Constants.TRUST;
        const hasSubmitted = !!contact.accessTokens.length && contact.accessTokens[0].submitted;
        const enhancedCompanyCDD = contact.cddRequired && contact.contactableType === EL.Constants.COMPANY && contact.cddType === EL.Constants.ENHANCED;
        return (
            <div>
                <ButtonToolbar className="pull-right">
                    <Link to={`/contacts/${contact.id}/edit`} className="btn btn-sm btn-default"><Icon iconName="pencil-square-o" />Edit</Link>
                    <Link to={`/contacts/${contact.id}/addresses`} className="btn btn-sm btn-default"><Icon iconName="pencil-square-o" />Addresses</Link>
                    <Button bsStyle="info" bsSize="sm" onClick={() => this.props.requestAMLCFT(contact.id)}><Icon iconName="pencil" />Get AML/CFT Token</Button>
                    <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteContact(contact.id)}><Icon iconName="trash" />Delete</Button>
                </ButtonToolbar>

                <h3>{fullname(contact)}</h3>
                <h4>{contact.contactableType}</h4>

                <dl  className="dl-horizontal">
                    <dt>Email</dt>
                    <dd>{contact.email || '-'}</dd>

                    <dt>Phone</dt>
                    <dd>{contact.phone || '-'}</dd>

                    <dt>Bank Account Number</dt>
                    <dd>{contact.bankAccountNumber || '-'}</dd>

                    <dt>IRD Number</dt>
                    <dd>{contact.irdNumber  || '-' }</dd>

                    <br />
                    { individual  && <IndividualDisplayFields contact={contact.contactable as EL.ContactIndividual} /> }
                    { trust && <TrustDisplayFields contact={contact.contactable as EL.ContactTrust} /> }

                     <br/>
                    <dt>Relationships</dt>
                    { (contact.relationships || []).map((relationship: EL.ContactRelationship, index: number) => {
                        return <dd key={index}><strong><Link to={`/contacts/${relationship.contact.id}`}>{ fullname(relationship.contact) }</Link></strong> is a <strong>{ relationship.relationshipType}</strong></dd>
                    }) }
                    { (contact.relationships || []).length === 0 && <dd>No relationships</dd> }
                    <br/>
                    <dt>Due Diligence</dt>
                    { (contact.cddRequired && contact.cddType && !contact.cddCompletionDate) && <dd>{contact.cddType } CDD required</dd> }
                    { enhancedCompanyCDD && (contact.contactable as EL.ContactCompany).enhancedCddReason && <dt>Enhanced CDD reason</dt>}
                    { enhancedCompanyCDD && (contact.contactable as EL.ContactCompany).enhancedCddReason && <dd>{(contact.contactable as EL.ContactCompany).enhancedCddReason}</dd>}
                    { enhancedCompanyCDD && (contact.contactable as EL.ContactCompany).sourceOfFunds && <dt>Source of funds</dt>}
                    { enhancedCompanyCDD && (contact.contactable as EL.ContactCompany).sourceOfFunds && <dd>{(contact.contactable as EL.ContactCompany).sourceOfFunds}</dd>}

                    { (contact.cddRequired && contact.cddType && contact.cddCompletionDate) && <dd>{contact.cddType } CCD completed on {contact.cddCompletionDate}</dd> }
                    { contact.cddRequired === false &&<dd>CDD not required</dd> }
                    { (!contact.cddRequired && contact.cddRequired !== false) &&<dd>CDD requirements unknown</dd> }
                     <br/>
                    <dt>Documents</dt>
                    <dd>{ (contact.files || []).map((file, i) => {
                        return <div key={file.id}><a target="_blank" href={`/api/files/${file.id}`}>{file.filename}</a></div>
                    }) }
                       { (contact.files || []).length === 0 && 'No Documents' }
                    </dd>

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




class CustomerDueDiligence extends React.PureComponent<{'cddRequired': boolean, 'contactableType': EL.Constants, 'cddType': string}> {
    render() {
        const { cddRequired, contactableType, cddType } = this.props;
        const enhancedCompanyCDD = cddRequired && contactableType === EL.Constants.COMPANY && cddType === EL.Constants.ENHANCED;
        if(![EL.Constants.INDIVIDUAL, EL.Constants.COMPANY, EL.Constants.TRUST, EL.Constants.PARTNERSHIP].includes(contactableType)){
            return false;
        }
        return <React.Fragment>
             <FormHeading title="Customer Due Diligence" />
            <CheckboxField name="cddRequired" label="CDD Required" />
            { this.props.cddRequired && <React.Fragment>
                <SelectField name='cddType' label='Type' options={[
                    {value: EL.Constants.SIMPLIFIED, text: EL.Constants.SIMPLIFIED},
                    {value: EL.Constants.STANDARD, text: EL.Constants.STANDARD},
                    {value: EL.Constants.ENHANCED, text: EL.Constants.ENHANCED}
                    ]} required prompt />
                   { enhancedCompanyCDD && <SelectField name='contactable.enhancedCddReason' label='CDD Reason' options={[
                        'Company is a vehicle for holding personal assets',
                        'Company has nominee shareholders or shares in bearer form',
                        'Level of risk warrants enhanced CDD'
                    ]} required prompt />}
                   { enhancedCompanyCDD && <TextArea name='contactable.sourceOfFunds' label='Source of Funds' required />}
                <DatePicker name="cddCompletionDate" label="CDD Completion Date"/>
               </React.Fragment> }
        </React.Fragment>
    }
}

const ConnectedCustomerDueDiligence = connect<{}, {}, {selector: (state: any, ...args) => any}>((state: EL.State, props: {selector: (state: any, ...args) => any}) => {
    return props.selector(state, 'cddRequired', 'contactableType', 'cddType')
})(CustomerDueDiligence as any);


class ContactName extends React.PureComponent<{'contactableType':string; 'contactable': any;}> {
    render() {
        const { contactableType } = this.props;
        if(contactableType === EL.Constants.INDIVIDUAL){
            return <div>
                    <ReadOnlyComponent label="Full Name" value={fullname({contactableType, contactable: this.props.contactable as EL.ContactIndividual})} />
                    <InputField name="contactable.title" label="Title" type="text" />
                    <InputField name="contactable.firstName" label="First Name" type="text" required/>
                    <InputField name="contactable.middleName" label="Middle Name" type="text" />
                    <InputField name="contactable.surname" label="Surname" type="text" required />
                    <InputField name="contactable.preferredName" label="Perferred Name" type="text" />
            </div>
        }
        return <InputField name="name" label="Name" type="text" required />

    }
}
const ConnectedContactName = connect<{}, {}, {selector: (state: any, ...args) => any}>((state: EL.State, props: {selector: (state: any, ...args) => any}) => {
    return props.selector(state, 'contactableType', 'contactable.firstName', 'contactable.middleName', 'contactable.surname');
})(ContactName as any);


class ContactTypeFields extends React.PureComponent<{'contactableType':string}> {
    render() {
        if(this.props.contactableType === EL.Constants.INDIVIDUAL){
            return <React.Fragment>
                   <FormHeading title="Individual Fields" />
                    <DatePicker name="contactable.dateOfBirth" label="Date of Birth" defaultView="year"/>
                    <DatePicker name="contactable.dateOfDeath" label="Date of Death" defaultView="year"/>
                    <InputField name="contactable.occupation" label="Occupation" type="text" />
                    <InputField name="contactable.countryOfCitizenship" label="Country of Citizenship" type="text" />
                    <SelectField name="contactable.maritalStatus" label="Marital Status" options={
                        ['', 'single', 'de facto', 'married', 'divorced', 'widow(er)'].map(k => ({text: k, value: k}))
                        } />
            </React.Fragment>
        }
        if(this.props.contactableType === EL.Constants.COMPANY){
             return <React.Fragment>
               <FormHeading title="Company Fields" />
                <InputField type="text" name="contactable.companyNumber" label="Company Number"/>
            </React.Fragment>
        }
        if(this.props.contactableType === EL.Constants.TRUST){
             return <React.Fragment>
              <FormHeading title="Trust Fields" />
                    <SelectField name="contactable.trustType" label="Trust Type" prompt options={
                        ['Discretionary', 'Fixed With 10 or Fewer Beneficiaries', 'Charitable', 'Other'].map(k => ({text: k, value: k}))
                        } required/>
            </React.Fragment>
        }
        return false;

    }
}

const ConnectedContactTypeFields = connect<{}, {}, {selector: (state: any, ...args) => any}>((state: EL.State, props: {selector: (state: any, ...args) => any}) => {
    return {contactableType: props.selector(state, 'contactableType')};
})(ContactTypeFields as any);

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
        const selector = formValueSelector(this.props.form);
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <SelectField name='contactableType' label='Type' options={[
                    {value: EL.Constants.INDIVIDUAL, text: EL.Constants.INDIVIDUAL},
                    {value: EL.Constants.COMPANY, text: EL.Constants.COMPANY},
                    {value: EL.Constants.TRUST, text: EL.Constants.TRUST},
                    {value: EL.Constants.PARTNERSHIP, text: EL.Constants.PARTNERSHIP},
                    {value: EL.Constants.COURT, text: EL.Constants.COURT},
                    {value: EL.Constants.BANK, text: EL.Constants.BANK},
                    {value: EL.Constants.LOCAL_AUTHORITY, text: EL.Constants.LOCAL_AUTHORITY},
                    {value: EL.Constants.GOVERNMENT_BODY, text: EL.Constants.GOVERNMENT_BODY},
                    ]} required prompt />
                <FormHeading title="Name" />
                <ConnectedContactName selector={selector} />

                <ConnectedContactTypeFields selector={selector} />

                <InputField name="email" label="Email" type="email" />
                <InputField name="phone" label="Phone" type="text" />
                <InputField name="bankAccountNumber" label="Bank Account Number" type="text" />
                <InputField name="irdNumber" label="IRD Number" type="text" />

                <Relationships />
                <DocumentList name="files" label="Documents" />

                <ConnectedCustomerDueDiligence  selector={selector} />

                <hr />

                <ButtonToolbar>
                    { /*<Link className="btn btn-default pull-right" to="/contacts">Back</Link> */ }
                    <Button bsStyle="primary" className="pull-right" type="submit">Submit</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}


class ContactFormSimple extends React.PureComponent<ContactFormProps> {

    render() {
        const selector = formValueSelector(this.props.form);
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <SelectField name='contactableType' label='Type' options={[
                    {value: EL.Constants.INDIVIDUAL, text: EL.Constants.INDIVIDUAL},
                    {value: EL.Constants.COMPANY, text: EL.Constants.COMPANY},
                    {value: EL.Constants.TRUST, text: EL.Constants.TRUST},
                    {value: EL.Constants.PARTNERSHIP, text: EL.Constants.PARTNERSHIP},
                    {value: EL.Constants.COURT, text: EL.Constants.COURT},
                    {value: EL.Constants.BANK, text: EL.Constants.BANK},
                    {value: EL.Constants.LOCAL_AUTHORITY, text: EL.Constants.LOCAL_AUTHORITY},
                    {value: EL.Constants.GOVERNMENT_BODY, text: EL.Constants.GOVERNMENT_BODY},
                    ]} required prompt />
                <FormHeading title="Name" />
                <ConnectedContactName selector={selector} />

                <ConnectedContactTypeFields selector={selector} />

                <InputField name="email" label="Email" type="email" />
                <InputField name="phone" label="Phone" type="text" />
            </Form>
        );
    }
}

const contactValidationRules: EL.IValidationFields = {
    name: { name: 'Name' },
    email: { name: 'Email' },
    phone: { name: 'Phone' },
}



const validateContact = (values: any) => {
   let errors = {} as any;
   if(!values.contactableType){
       errors.contactableType = 'Type Required'
   }
   if(values.contactableType === EL.Constants.INDIVIDUAL){
       errors.contactable = validate({
            firstName: { name: 'First Name', required: true },
            surname: { name: 'Surname', required: true },
        }, values.contactable || {});
   }
   if(values.contactableType === EL.Constants.TRUST){
       errors.contactable = validate({
            name: { name: 'Name', required: true },
            trustType: { name: 'Trust Type', required: true },
        }, values.contactable || {});
   }
   else{
       errors = {...errors, ...validate({
            firstName: { name: 'Name', required: true }
       }, values) };
   }
   errors.relationships =  (values.relationships || []).map((relationship: EL.ContactRelationship) => {
       return validate({
               secondContactId: { name: 'Name', required: true },
               relationshipType: { name: 'Type', required: true }
       }, relationship);
   })
   if(values.cddRequired){
       if(!values.cddType){
           errors.cddType = 'CDD Type Required';
       }
       const enhancedCompanyCDD = values.cddRequired && values.contactableType === EL.Constants.COMPANY && values.cddType === EL.Constants.ENHANCED;
       const hasBeneficial = (values.relationships || []).some((relationship: EL.ContactRelationship) => {
           return relationship.relationshipType === 'Beneficial Owner';
       });
       if(enhancedCompanyCDD && !hasBeneficial){
           errors.relationships._error = 'At least one beneficial owner required';
       }
   }
   return errors;
}

export const CreateContactForm = (reduxForm({
    form: EL.FormNames.CREATE_CONTACT_FORM,
    validate: validateContact,
})(ContactForm as any) as any);

export const CreateContactFormSimple = (reduxForm({
    form: EL.FormNames.CREATE_CONTACT_FORM_SIMPLE,
    validate: validateContact
})(ContactFormSimple as any) as any);

const EditContactForm = (reduxForm({
    form: EL.FormNames.EDIT_CONTACT_FORM,
    validate: validateContact,
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

