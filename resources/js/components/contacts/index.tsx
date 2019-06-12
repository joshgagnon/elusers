import * as React from 'react';
import { ContactsHOC, ContactHOC } from '../hoc/resourceHOCs';
import Table from '../dataTable';
import PanelHOC from '../hoc/panelHOC';
import { Form, ButtonToolbar, Button, ProgressBar, Alert, FormControl } from 'react-bootstrap';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea, Combobox } from '../form-fields';
import ReadOnlyComponent from '../form-fields/readOnlyComponent';
import { reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate } from '../utils/validation';
import { fullname } from '../utils';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Icon from '../icon';
import { connect } from 'react-redux';
import { createNotification, createResource, updateResource, deleteResource, confirmAction, showAMLCFTToken, showUploadModal  } from '../../actions';
import MapParamsToProps from '../hoc/mapParamsToProps';
import { AddressFields, validationRules as addressValidationRules } from '../address/form';
import { ContactCapacity } from './amlcft';
import { Relationships, Agents } from './relationships';
import { ContactSelector } from './contactSelector';
import { ContactInformationFields } from '../contact-information/contactInformation';
import * as ReactList from 'react-list';
import { hasPermission } from '../utils/permissions';
import HasPermissionHOC from '../hoc/hasPermission';
import { DocumentsTree } from 'components/documents/documentsTree';


interface ContactsProps {
    contacts: EL.Resource<EL.Contact[]>;
    showUploadModal: () => void;
}

const HEADINGS = ['Name', 'Type', 'Email', 'Phone', 'Actions'];


interface ContactState {
    searchValue: string;
}


const  requestAMLCFT = (contactId: string) => {
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
}


const FormHeading = (props: {title: string}) => <h5 className="text-center">{ props.title }</h5>


function filterData(search: string, data: EL.Contact[]) {
    if(search){
        return data.filter(contact => fullname(contact).toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    }
    data.sort((a, b) => fullname(a).localeCompare(fullname(b)));
    return data;
}

const emails = (contact: EL.Contact, hrefs=false) => {
    const emails = contact.contactInformations.filter(c => c.type === 'email');
    return emails.length > 0  && emails.map((email, i) => <span style={{ display: "block"}} key={i}>{email.data.subtype && `[${email.data.subtype}] `}
                                            <a href={`mailto:${email.data.email}`}>{ email.data.email }</a>{ email.data.notes && ` ${email.data.notes}`}
                                            </span>);
}

const phones = (contact: EL.Contact) => {
    const phones = contact.contactInformations.filter(c => c.type === 'phone');
    return phones.length > 0 && phones.map((phone, i) => <span style={{ display: "block"}} key={i}>{phone.data.subtype && `[${phone.data.subtype}] `}{ phone.data.phone }{ phone.data.notes && ` ${phone.data.notes}`}</span>);
}

const faxes = (contact: EL.Contact) => {
    const phones = contact.contactInformations.filter(c => c.type === 'fax');
    return phones.length > 0 && phones.map((fax, i) => <span style={{ display: "block"}} key={i}>{fax.data.subtype && `[${fax.data.subtype}] `}{fax.data.fax }{ fax.data.notes && ` ${fax.data.notes}`}</span>);
}


const addresses = (contact: EL.Contact) => {
    const addresses = contact.contactInformations.filter(c => c.type === 'address');
    return addresses.length > 0 && addresses.map((address, i) => <React.Fragment key={i}>
        { ['subtype', 'addressOne', 'addressTwo', 'city', 'county', 'state',  'postCode', 'country'].map(key => {
            if(address.data[key]){
                return <span style={{ display: "block", fontWeight: key === 'subtype' ? 'bold' : 'normal'}} key={key}>{ address.data[key]}</span>
            }
        }) }
        <br/>
        </React.Fragment>);
}

@HasPermissionHOC('view contacts')
@ContactsHOC({cache:true})
@(PanelHOC<ContactsProps>('Contacts', props => props.contacts) as any)
@(connect((state: EL.State) => ({user: state.user}), {
    showUploadModal: () => showUploadModal({uploadType: 'contacts'})
}) as any)
export class Contacts extends React.PureComponent<ContactsProps & {user: EL.User}, ContactState> {

    state = {
        searchValue: ''
    }

    render() {
        const data = filterData(this.state.searchValue, this.props.contacts.data);
        return (
            <div>
                { hasPermission(this.props.user, 'create contact') && <ButtonToolbar>
                    <Link to="/contacts/create" className="btn btn-primary"><Icon iconName="plus" />Create Contact</Link>
                    <Button onClick={this.props.showUploadModal}><Icon iconName="plus" />Upload Contact List</Button>
                </ButtonToolbar> }

                <div className="search-bar">
                    <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={(e: any) => this.setState({searchValue: e.target.value})} />
                </div>
                <div className="lazy-table">
                    <ReactList
                        type='uniform'
                        useStaticSize={true}
                        threshold={200}
                        itemRenderer={(index) => {
                            const contact = data[index]; //cause the header
                            if(!contact){
                                return false;
                            }
                            const email = emails(contact, true);
                            const phone = phones(contact);
                            const cddComplete = !!contact.cddCompletionDate;
                            const cddNotNeeded = (!cddComplete && [EL.Constants.COURT, EL.Constants.BANK, EL.Constants.LOCAL_AUTHORITY, EL.Constants.GOVERNMENT_BODY].includes(contact.contactableType as EL.Constants))
                                || contact.reasonNoCddRequired;
                            const cddIncomplete = contact.cddRequired && !cddComplete && !cddNotNeeded;
                            const cddUnknown = !cddNotNeeded && !cddComplete && !cddIncomplete;

                            return <tr key={contact.id}>
                            <td>{fullname(contact)}</td>
                            <td>{contact.contactableType}</td>
                            <td>{email || '' }</td>
                            <td>{phone || ''}</td>

                            <td className="actions">
                                <Link className="btn btn-xs btn-default" to={`/contacts/${contact.id}`}><Icon iconName="eye" />View</Link>
                                { hasPermission(this.props.user, 'edit contact') &&  <Link className="btn btn-xs btn-warning" to={`/contacts/${contact.id}/edit`}><Icon iconName="pencil" />Edit</Link> }
                                { cddComplete && <a className="btn btn-success btn-xs" title="CDD complete"><Icon iconName="check" />CDD</a> }
                                { cddNotNeeded && <a className="btn btn-default btn-xs" title="CDD not required"><Icon iconName="check" />CDD</a> }
                                { cddIncomplete && <a className="btn btn-warning btn-xs" title="CDD incomplete"><Icon iconName="times" />CDD</a> }
                                { cddUnknown && <a className="btn btn-danger btn-xs" title="CDD requires unknown"><Icon iconName="question" />CDD</a> }
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
    user: EL.User,
    contactId: string;
    canUpdate: boolean;
    deleteContact: (contactId: string) => void;
    requestAMLCFT: (contactId: string) => void;
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


export class CDDBadge extends React.PureComponent<{contact: EL.Contact, requestAMLCFT: (contactId: string) => void }> {
    render() {
        if(this.props.contact.contactableType !== EL.Constants.INDIVIDUAL) {
            return false;
        }
        const hasCDDCompleted = this.props.contact.cddCompletionDate;
        if(hasCDDCompleted) {
            return <a className="btn btn-success btn-xs">CDD Complete</a>
        }
        return <a className="btn btn-danger btn-xs" onClick={() => this.props.requestAMLCFT(this.props.contact.id.toString())}>CDD Missing</a>
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

interface ContactDocumentProps {
    contact: EL.Resource<EL.Contact>;
    user: EL.User,
    contactId: string;
    canUpdate: boolean;
}


class ContactDocuments extends React.PureComponent<ContactDocumentProps> {
    render() {
        return <DocumentsTree
            title="Contact Documents"
            files={this.props.contact.data ? this.props.contact.data.files : []}
            matterId={this.props.contactId}
            basePath={`contact/${this.props.contactId}`}
            cached={this.props.contact.cached}
            canUpdate={this.props.canUpdate} />
    }
}



@PanelHOC<ContactProps& {user: EL.User}>('Contact', props => props.contact)
export class ContactDetails extends React.PureComponent<ContactProps> {

    render() {
        const contact = this.props.contact.data;
        const individual = contact.contactableType === EL.Constants.INDIVIDUAL;
        const trust = contact.contactableType === EL.Constants.TRUST;
        const hasSubmitted = !!contact.accessTokens.length && contact.accessTokens[0].submitted;
        const enhancedCDD = contact.cddRequired && contact.cddType === EL.Constants.ENHANCED;
        const enhancedCddReason = contact.enhancedCddReason;
        const enhancedTrustShowBeneficiaryClasses = enhancedCDD && (contact.contactable as EL.ContactTrust).trustType === 'Discretionary';
        const enhancedTrustShowObjects = enhancedCDD && (contact.contactable as EL.ContactTrust).trustType === 'Charitable';
        return (
            <div>
                <ButtonToolbar className="pull-right">
                    { hasPermission(this.props.user, 'edit contact') &&  <Link to={`/contacts/${contact.id}/edit`} className="btn btn-sm btn-default"><Icon iconName="pencil-square-o" />Edit</Link> }
                    { contact.contactableType === EL.Constants.INDIVIDUAL &&
                      !contact.cddCompletionDate &&
                         <Button bsStyle="info" bsSize="sm" onClick={() => this.props.requestAMLCFT(contact.id.toString())}><Icon iconName="pencil" />Get AML/CFT Token</Button> }
                     { hasPermission(this.props.user, 'edit contact') &&<Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteContact(contact.id.toString())}><Icon iconName="trash" />Delete</Button> }
                </ButtonToolbar>

                <h3>{fullname(contact)}</h3>
                <h4>{contact.contactableType}</h4>

                <dl  className="dl-horizontal">

                    <dt>Email</dt>
                    <dd>{ emails(contact, true) }</dd>

                    <dt>Phone</dt>
                    <dd>{ phones(contact) }</dd>

                    <dt>Fax</dt>
                    <dd>{ faxes(contact) }</dd>

                    <dt>Address</dt>
                    <dd>{ addresses(contact) }</dd>


                    <dt>Bank Account Number</dt>
                    <dd>{contact.bankAccountNumber || '-'}</dd>

                    <dt>IRD Number</dt>
                    <dd>{contact.irdNumber  || '-' }</dd>

                    <br />
                    { individual  && <IndividualDisplayFields contact={contact.contactable as EL.ContactIndividual} /> }
                    { trust && <TrustDisplayFields contact={contact.contactable as EL.ContactTrust} /> }

                     <br/>
                    <dt>Agents</dt>
                    { (contact.agents || []).map((agent: EL.ContactAgent, index: number) => {
                        return <dd key={index}><strong><Link to={`/contacts/${agent.contact.id}`}>{ fullname(agent.contact) }</Link></strong> <CDDBadge contact={agent.contact} requestAMLCFT={this.props.requestAMLCFT}/></dd>
                    }) }
                    { (contact.agents || []).length === 0 && <dd>No Agents</dd> }
                     <br/>

                    <dt>Relationships</dt>
                    { (contact.relationships || []).map((relationship: EL.ContactRelationship, index: number) => {
                        return <dd key={index}><strong><Link to={`/contacts/${relationship.contact.id}`}>{ fullname(relationship.contact) }</Link></strong> is a <strong>{ relationship.relationshipType}</strong></dd>
                    }) }
                    { (contact.relationships || []).length === 0 && <dd>No relationships</dd> }
                    <br/>
                    <dt>AMLCFT CDD</dt>

                    { (contact.cddRequired && contact.cddType && !contact.cddCompletionDate) && <dd>{contact.cddType } CDD required</dd> }

                    { enhancedCddReason && <React.Fragment>
                        <dt>Enhanced CDD reason</dt>
                        <dd>{contact.enhancedCddReason}</dd>
                        </React.Fragment> }

                    { enhancedTrustShowBeneficiaryClasses && (contact.contactable as EL.ContactTrust).clauseOfTrustDeed &&
                            <React.Fragment>
                                <dt>Classes of Beneficiaries</dt>
                                <dd>{ (contact.contactable as EL.ContactTrust).clauseOfTrustDeed }</dd>
                            </React.Fragment> }

                   { enhancedTrustShowObjects && (contact.contactable as EL.ContactTrust).clauseOfTrustDeed &&
                            <React.Fragment>
                                <dt>Clause of Trust Deed Describing Objects of Trust</dt>
                                <dd>{ (contact.contactable as EL.ContactTrust).clauseOfTrustDeed }</dd>
                            </React.Fragment> }

                    { contact.sourceOfFunds &&
                        <React.Fragment>
                            <dt>Source of funds</dt>
                            <dd>{contact.sourceOfFunds}</dd>
                        </React.Fragment>
                     }

                    { (contact.cddRequired && contact.cddType && contact.cddCompletionDate) && <dd>{contact.cddType } CDD completed on {contact.cddCompletionDate}</dd> }
                    { contact.cddRequired === false &&<dd>CDD not required{ !!contact.reasonNoCddRequired && ` - ${contact.reasonNoCddRequired}`}</dd> }
                    { (!contact.cddRequired && contact.cddRequired !== false) &&<dd>CDD requirements unknown</dd> }

                     <br/>
                    <dt>Matters</dt>
                    <dd>{ (contact.matters || []).map((matter, i) => {
                        return <div key={matter.id}><Link to={`/matters/${matter.id}`}>{matter.matterNumber}</Link></div>
                    }) }
                       { (contact.matters || []).length === 0 && 'No Matters' }
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

@HasPermissionHOC('view contacts')
@(connect(
    (state: EL.State) => ({user: state.user, canUpdate: hasPermission(state.user, 'edit contact')}),
    {
        deleteContact: (contactId: string) => {
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
        requestAMLCFT,
    }
) as any)
@MapParamsToProps(['contactId'])
@ContactHOC({cache: true})
export class Contact extends React.PureComponent<ContactProps> {
    render() {
        return <React.Fragment>
            <ContactDetails {...this.props} />
            <ContactDocuments {...this.props}  />
        </React.Fragment>
    }

}




const canCdd = (contactableType: string) => {
    return [EL.Constants.INDIVIDUAL, EL.Constants.COMPANY, EL.Constants.TRUST].includes(contactableType as EL.Constants);
}


class CustomerDueDiligence extends React.PureComponent<{'cddRequired': boolean, 'contactableType': EL.Constants, 'cddType': string, 'contactable': {'trustType': string}}> {
    render() {
        const { cddRequired, contactableType, cddType, contactable} = this.props;
        const trustType = contactable && contactable.trustType;
        const enhancedCDD = cddRequired && cddType === EL.Constants.ENHANCED;
        const enhancedCompanyCDD = enhancedCDD && contactableType === EL.Constants.COMPANY;
        const enhancedTrustCDD = enhancedCDD && contactableType === EL.Constants.TRUST;

        const cddTypes = [ {value: EL.Constants.SIMPLIFIED, text: EL.Constants.SIMPLIFIED},
                    {value: EL.Constants.STANDARD, text: EL.Constants.STANDARD},
                    {value: EL.Constants.ENHANCED, text: EL.Constants.ENHANCED}];

        if(!canCdd(contactableType)){
            return false;
        }


        return <React.Fragment>
             <FormHeading title="Customer Due Diligence" />
            <CheckboxField name="cddRequired" label="CDD Required" />

            { this.props.cddRequired && <React.Fragment>
                <SelectField name='cddType' label='Type' options={cddTypes} required prompt />
                   { enhancedCompanyCDD && <SelectField name='enhancedCddReason' label='CDD Reason' options={[
                        'Company is a vehicle for holding personal assets',
                        'Company has nominee shareholders or shares in bearer form',
                        'Level of risk warrants enhanced CDD'
                    ]} required prompt />}

                   { enhancedCDD && <TextArea name='sourceOfFunds' label='Source of Funds' required /> }

                 { enhancedTrustCDD && trustType === 'Discretionary' && <TextArea name='contactable.clauseOfTrustDeed' label='Classes of Beneficiaries' /> }
                 { enhancedTrustCDD && trustType === 'Charitable' && <TextArea name='contactable.clauseOfTrustDeed' label='Clause of Trust Deed Describing Objects of Trust' /> }

                <DatePicker name="cddCompletionDate" label="CDD Completion Date" />

               </React.Fragment> }

              { !this.props.cddRequired && <Combobox name='reasonNoCddRequired' label='Reason CDD not required'  data={[
                        'Business relationship established before 1 July 2018',
                        'Contact is not a client, a beneficial owner of a client, nor an agent of a client'
                         ]}/> }
        </React.Fragment>
    }
}

const ConnectedCustomerDueDiligence = connect<{}, {}, {selector: (state: any, ...args) => any}>((state: EL.State, props: {selector: (state: any, ...args) => any}) => {
    return props.selector(state, 'cddRequired', 'contactableType', 'cddType', 'contactable.trustType')
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



class ContactInformations extends React.PureComponent<{selector: (state: any, ...args) => any }> {
    render() {

        return <React.Fragment>
                   <FormHeading title="Contact Information" />
                   <FieldArray name="contactInformations" component={ContactInformationFields as any} selector={this.props.selector} />
            </React.Fragment>

    }
}


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
                <div className="form-group-sm">
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
                                              <hr />
                    <ConnectedCustomerDueDiligence  selector={selector} />    
                     <hr />
                    <ContactInformations selector={selector}/>
                    <hr />
                    <ConnectedContactTypeFields selector={selector} />
                         <hr />

                     <FormHeading title="Financials" />
                    <InputField name="bankAccountNumber" label="Bank Account Number" type="text" />
                    <InputField name="irdNumber" label="IRD Number" type="text" />
                                          <hr />
                    <Agents />
                                          <hr />
                    <Relationships />
            
                    </div>
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

            </Form>
        );
    }
}

const contactValidationRules: EL.IValidationFields = {
    name: { name: 'Name' },
}

const validateContactInformation = (values: any) => {
    return values.map(contactInformation => {
        if(contactInformation.type === 'email'){
            if(!contactInformation.data || !contactInformation.data.email){
                return {data: {email: 'Email Required'}};
            }
        }
        if(contactInformation.type === 'fax'){
            if(!contactInformation.data || !contactInformation.data.fax){
                return {data: {fax: 'Fax Required'}};
            }
        }
        if(contactInformation.type === 'phone'){
            if(!contactInformation.data || !contactInformation.data.phone){
                return {data: {phone: 'Phone Required'}};
            }
        }
        if(contactInformation.type === 'address'){
            return {data: validate(addressValidationRules, contactInformation.data || {})};
        }

    })
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
       const enhancedCompanyCDD = values.contactableType === EL.Constants.COMPANY && values.cddType === EL.Constants.ENHANCED;
       const hasBeneficial = (values.relationships || []).some((relationship: EL.ContactRelationship) => {
           return relationship.relationshipType === 'Beneficial Owner';
       });
       if(enhancedCompanyCDD && !hasBeneficial){
           errors.relationships._error = 'At least one beneficial owner required';
       }
       const enhancedTrustCDD = values.contactableType === EL.Constants.TRUST && values.cddType === EL.Constants.ENHANCED;

       if(values.contactableType === EL.Constants.TRUST && values.cddType !== EL.Constants.ENHANCED) {
           errors.cddType = 'Trusts must have Enhanced CDD'
       }

       const hasBeneficary = (values.relationships || []).some((relationship: EL.ContactRelationship) => {
           return relationship.relationshipType === 'Beneficiary';
       });

       if(enhancedTrustCDD && !hasBeneficary && values.contactable && values.contactable.trustType === 'Fixed With 10 or Fewer Beneficiaries'){
           errors.relationships._error = 'At least one beneficiary required';
       }
   }
   if(values.contactInformations){
       errors.contactInformations = validateContactInformation(values.contactInformations);
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


@HasPermissionHOC('create contact')
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
    submit?: (contactId: string, data: React.FormEvent<Form>) => void;
    contactId: string;
    contact?: EL.Resource<EL.Contact>;
}


@HasPermissionHOC('edit contact')
@(connect(
    undefined,
    {
        submit: (contactId: string, data: React.FormEvent<Form>) => {
            const url = `contacts/${contactId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Contact updated.'), (response) => push(`/contacts/${contactId}`)],
                onFailure: [createNotification('Contact update failed. Please try again.', true)],
            };

            return updateResource(url, data, meta);
        }
    }
) as any)
@PanelHOC<UnwrappedEditContactProps>('Edit Contact', props => props.contact)
class UnwrappedEditContact extends React.PureComponent<UnwrappedEditContactProps> {
    render() {
        return <EditContactForm initialValues={this.props.contact.data} onSubmit={data => this.props.submit(this.props.contactId, data)} saveButtonText="Save Contact" />
    }
}


@(connect((state: EL.State) => ({user: state.user})) as any)
@MapParamsToProps(['contactId'])
@ContactHOC({cache: true})
export class EditContact extends React.PureComponent<{ contactId: string, contact: EL.Resource<EL.Contact>, user: EL.User } > {
    render() {
        return <React.Fragment>
             <UnwrappedEditContact {...this.props} />
              <ContactDocuments {...this.props}  canUpdate={true}/>
        </React.Fragment>
    }
}

