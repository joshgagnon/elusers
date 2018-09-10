import * as React from 'react';
import { ContactsHOC, ContactHOC, TokenHOC } from '../hoc/resourceHOCs';
import WaitForResource from '../hoc/waitForResource';
import Table from '../dataTable';
import PanelHOC from '../hoc/panelHOC';
import { Form, ButtonToolbar, Button, ProgressBar } from 'react-bootstrap';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField } from '../form-fields';
import { reduxForm, formValueSelector, InjectedFormProps, FormSection } from 'redux-form';
import { validate } from '../utils/validation';
import { fullname } from '../utils';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Icon from '../icon';
import { connect } from 'react-redux';
import { createNotification, createResource, updateResource, deleteResource, confirmAction } from '../../actions';
import MapParamsToProps from '../hoc/mapParamsToProps';
import { AddressFields, validationRules as addressValidationRules } from '../address/form';


interface ContactFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    saveButtonText: string;
}


const AMLCFTFields = [
    () => {
        return <React.Fragment>
            <h4 className={"text-center"}>Name & Date of Birth</h4>
            <InputField name="contactable.firstName" label="First Name" type="text" required/>
            <InputField name="contactable.middleName" label="Middle Name" type="text" />
            <InputField name="contactable.surname" label="Surname" type="text" required />
            <DatePicker name="contactable.dateOfBirth" label="Date of Birth" defaultView="decade" />
        </React.Fragment>
    },

    () => {
        return <React.Fragment>
            <h4 className={"text-center"}>Residential Address</h4>
            <FormSection name="addresses[0]">
                <AddressFields />
            </FormSection>
        </React.Fragment>
    },

    () => {
        return <React.Fragment>
            <h4 className={"text-center"}>Supporting Documents</h4>
            <DocumentList name="files" label="Documents" help={
                <span>Please provide a certified copy of your Photo ID and a proof of address</span>
            }/>
        </React.Fragment>
    },

    () => {
        return <React.Fragment>
            <h4 className={"text-center"}>Capacity</h4>
            <ContactCapacity required/>
        </React.Fragment>
    }

]


@(reduxForm({
    form: EL.FormNames.EDIT_CONTACT_AMLCFT_FORM,
    validate: values => validate({
    firstName: { name: 'First Name', required: true },
    surname: { name: 'Surname', required: true }
    }, values),
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true,
}) as any)
class AMLCFTPage1 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void}> {
    fields = AMLCFTFields[0]
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
            <Fields/>
            { this.props.children }
        </Form>
    }
}

@(reduxForm({
    form: EL.FormNames.EDIT_CONTACT_AMLCFT_FORM,
    validate: (values) => validate(addressValidationRules, values),
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true,
}) as any)
class AMLCFTPage2 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void}> {
    fields = AMLCFTFields[1]
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
             <Fields/>
            { this.props.children }
        </Form>
    }
}

@(reduxForm({
    form: EL.FormNames.EDIT_CONTACT_AMLCFT_FORM,
    validate: (values) => validate({files: { name: 'Document', minItems: 1}}, values),
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true,
}) as any)
class AMLCFTPage3 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void}> {
    fields = AMLCFTFields[2];
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
             <Fields/>
            { this.props.children }
        </Form>
    }
}

export const ContactCapacity = (props: {required?: boolean}) => {
    return         <SelectField prompt={true} name="capacity" label="Are we acting for a trust or another entity holding personal assets?"
    options={[{value: 'no', text: 'No'}, {value: 'trust', text: 'Yes - Trust'}, {value: 'company', text: 'Yes - Company'}]}
    required={props.required}>
    </SelectField>
}


@(reduxForm({
    form: EL.FormNames.EDIT_CONTACT_AMLCFT_FORM,
    validate: (values) => validate({capacity: { name: 'Capacity', required: true}}, values),
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true,
}) as any)
@(connect((state: EL.State) => {
return {
    capacity: formValueSelector(EL.FormNames.EDIT_CONTACT_AMLCFT_FORM)(state, 'capacity')
}}) as any)
class AMLCFTPage4 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void; capacity: string }> {
    fields = AMLCFTFields[3];
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
        <ContactCapacity required/>
        { this.props.capacity === 'trust' && <DocumentList name="trust_deed_files" label="Trust Deed" /> }
        { this.props.capacity === 'company' && <CheckboxField name="confirmation" label="">
            <strong>I confirm I am the person acting on behalf of the company in this matter</strong>
            </CheckboxField> }
            { this.props.children }
        </Form>
    }
}


@(reduxForm({
    form: EL.FormNames.EDIT_CONTACT_AMLCFT_FORM,
    validate: (values) => validate({authority_confirm: { name: 'Confirmation', required: true}}, values),
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true,
}) as any)
@(connect((state: EL.State) => {
    return formValueSelector(EL.FormNames.EDIT_CONTACT_AMLCFT_FORM)(state, 'contactableType', 'contactable.firstName', 'contactable.middleName', 'contactable.surname')
}) as any)
class AMLCFTPage5 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void; capacity: string }> {
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const name = fullname(this.props as any);
        return <Form horizontal onSubmit={handleSubmit}>
            <CheckboxField name="authority_confirm" label="" >
            <strong>I confirm that I am {name} or, if I am not {name}, that I am submitting this form on behalf of, and with the authority of, {name}.</strong>
            </CheckboxField>
            { this.props.children }
        </Form>
    }
}




class ContactAMLCFTForm extends React.PureComponent<ContactFormProps, {page: number}> {
    state = {page: 0};
    pages=[
        AMLCFTPage1,
        AMLCFTPage2,
        AMLCFTPage3,
        AMLCFTPage4,
        AMLCFTPage5
    ];
    controls() {
        return <div className="button-row">
            { this.state.page > 0 && <Button onClick={() => this.setState({page: this.state.page-1})}>Back</Button>}
            { this.state.page < this.pages.length - 1  && <Button  bsStyle="primary" type="submit">Next</Button>}
            { this.state.page == this.pages.length - 1 && <Button bsStyle="primary" type="submit">Submit</Button> }
        </div>
    }

    submit(values) {
        this.props.onSubmit(values);
    }

    render() {
        const Page =  this.pages[this.state.page] as any;
        const onSubmit = this.state.page == this.pages.length - 1 ? (values) => this.submit(values) : () => this.setState({page: this.state.page+1});
        return <div>
            <ProgressBar striped bsStyle="success"
                label={` Step ${this.state.page+1} of ${this.pages.length} `}
                now={(this.state.page+1)/(this.pages.length) * 100}
            />

            <Page onSubmit={onSubmit}>
                { this.controls() }
            </Page>
            </div>
    }
}

const EditContactAMLCFTForm= (reduxForm({
    form: EL.FormNames.EDIT_CONTACT_AMLCFT_FORM,
})(ContactAMLCFTForm as any) as any);


class FullAMLCFTForm extends React.PureComponent<ContactFormProps> {

    render() {
        const { handleSubmit, } = this.props;
        const name = fullname(this.props as any);
        return <Form horizontal onSubmit={handleSubmit}>
                { AMLCFTFields.map((Fields, i) => <Fields key={i} /> )}
                <DatePicker name="cddCompletionDate" label="CDD Completion Date"/>
                { this.props.children }
            </Form>
    }
}

const EditFullAMLCFTForm= (reduxForm({
    form: EL.FormNames.EDIT_CONTACT_AMLCFT_FORM,
})(FullAMLCFTForm as any) as any);

interface UnwrappedExternalContactAMLCFTProps {
    submit?: (token: string, data: React.FormEvent<Form>) => void;
    contact?: EL.Resource<EL.Contact & {addresses: EL.IAddress[]}>;
    token?: string;
}


@(connect(
          undefined,
    {
        submit: (token: string, data: React.FormEvent<Form>) => {
           const url = `access_token/${token}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Information updated.'), (response) => push('/amlcft/complete')],
                onFailure: [createNotification('Update failed. Please try again.', true)],
            };

            return updateResource(url, data, meta);
        }
    }
) as any)
@TokenHOC('contact')
@PanelHOC<UnwrappedExternalContactAMLCFTProps>('AML/CFT Due Diligence Form', props => props.contact, () => <div>Sorry, this link has expired</div>)
class UnwrappedExternalContactAMLCFT extends React.PureComponent<UnwrappedExternalContactAMLCFTProps> {
    render() {
        let values = this.props.contact.data;
        return <EditContactAMLCFTForm initialValues={this.props.contact.data} onSubmit={data => this.props.submit(this.props.token, data)}  />
    }
}


export class ExternalAMLCFT extends React.PureComponent<{ params: { token: string; } }> {
    render() {
        return <UnwrappedExternalContactAMLCFT token={this.props.params.token} />
    }
}


@PanelHOC('AML/CFT Due Diligence Form')
export class ExternalAMLCFTComplete extends React.PureComponent {
    render() {
        return <div>
        <p>Thank you for your submission.</p>
        </div>
    }
}

interface UnwrappedEditContactProps {
    submit?: (contactId: number, data: React.FormEvent<Form>) => void;
    contactId: number;
    contact?: EL.Resource<EL.Contact>;
}

@TokenHOC('contact')
@WaitForResource((props: any) => props.contact)
class TokenContactAMLCFTForm extends React.PureComponent<any> {
    render() {
        return <EditFullAMLCFTForm initialValues={this.props.contact.data} onSubmit={data => this.props.submit(this.props.contactId, this.props.token, this.props.originalContact, data)}>
           <div className="button-row">
            <Button bsStyle="primary" type="submit">Merge Information into Contact</Button>
            </div>
        </EditFullAMLCFTForm>
    }
}

@(connect(
    undefined,
    {
        submit: (contactId: number, token: string, originalContact: EL.Contact, data: any) => {
            const url = `contacts/${contactId}`;
            const merged = {...originalContact, ...data, filesToCopy: data.files, files: originalContact.files};
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Contact updated.'), (response) => push(`/contacts/${contactId}`)],
                onFailure: [createNotification('Contact update failed. Please try again.', true)],
            };
            const actions = [updateResource(url, merged, meta)] as any;
            if(data.addresses && data.addresses.length && data.addresses[0].id){
                // update address
                const addressId = data.addresses[0].id;
                actions.push(updateResource(`contacts/${contactId}/addresses/${addressId}`, data.addresses[0]));
            }
            else if(data.addresses && data.addresses.length){
                //they never had an address, create it
                actions.push(createResource(`contacts/${contactId}/addresses`, data.addresses[0]));
            }
            actions.push(deleteResource(`access_token/${token}`));

            return confirmAction({
                title: 'Merge Information',
                content: 'Selecting merge will update this contact with the information and documents given.',
                acceptButtonText: 'Merge',
                declineButtonText: 'Cancel',
                onAccept: actions
            });
        }
    }
) as any)
@ContactHOC()
@PanelHOC<UnwrappedEditContactProps>('Merge Information', props => props.contact)
class UnwrappedEditContact extends React.PureComponent<UnwrappedEditContactProps> {
    render() {
      if(!this.props.contact.data.accessTokens || !this.props.contact.data.accessTokens.length) {
          return <p className="text-danger">Sorry, this token does not exist</p>
      }
      return <TokenContactAMLCFTForm
          contactId={this.props.contactId}
          originalContact={this.props.contact.data}
          token={this.props.contact.data.accessTokens[0].token}
          submit={this.props.submit}  />
    }
}

export class MergeContact extends React.PureComponent<{ params: { contactId: number; } }> {
    render() {
        return <UnwrappedEditContact contactId={this.props.params.contactId} />
    }
}
