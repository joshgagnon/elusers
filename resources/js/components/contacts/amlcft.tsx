import * as React from 'react';
import { ContactsHOC, ContactHOC } from '../hoc/resourceHOCs';
import Table from '../dataTable';
import PanelHOC from '../hoc/panelHOC';
import { Form, ButtonToolbar, Button, ProgressBar } from 'react-bootstrap';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField } from '../form-fields';
import { reduxForm, formValueSelector, InjectedFormProps } from 'redux-form';
import { validate } from '../utils/validation';
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
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        return <Form onSubmit={handleSubmit}>
            <h4 className={"text-center"}>Name & Date of Birth</h4>
            <InputField name="firstName" label="First Name" type="text" required/>
            <InputField name="middleName" label="Middle Name" type="text" />
            <InputField name="surname" label="Surname" type="text" required />
            <DatePicker name="dateOfBirth" label="Date of Birth" defaultView="decade"/>
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
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        return <Form onSubmit={handleSubmit}>
            <h4 className={"text-center"}>Address</h4>
            <AddressFields />
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
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        return <Form onSubmit={handleSubmit}>
            <h4 className={"text-center"}>Supporting Documents</h4>
            <DocumentList name="files" label="Documents" help={
                <span>Please provide a certified copy of your Photo ID and a proof of address</span>
            }/>
            { this.props.children }
        </Form>
    }
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
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        return <Form onSubmit={handleSubmit}>
        <h4 className={"text-center"}>Capacity</h4>
        <SelectField prompt={true} name="capacity" label="Are we acting for a trust or another entity holding personal assets?"
        options={[{value: 'no', text: 'No'}, {value: 'trust', text: 'Yes - Trust'}, {value: 'company', text: 'Yes - Company'}]}
        required>
        </SelectField>
        { this.props.capacity === 'trust' && <DocumentList name="trust_deed_files" label="Trust Deed" /> }
        { this.props.capacity === 'company' && <CheckboxField name="confirmation" label="">
            <strong>I confirm I am the person acting on behalf of the company in this matter</strong>
            </CheckboxField> }
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
    ];
    controls() {
        return <div className="button-row">
            { this.state.page > 0 && <Button onClick={() => this.setState({page: this.state.page-1})}>Back</Button>}
            { this.state.page < this.pages.length - 1  && <Button  bsStyle="primary" type="submit">Next</Button>}
            { this.state.page == this.pages.length - 1 && <Button bsStyle="primary" type="submit">Submit</Button> }
        </div>
    }

    submit(values) {

    }

    render() {
        const Page =  this.pages[this.state.page] as any;
        const onSubmit = this.state.page == this.pages.length - 1 ? this.submit : () => this.setState({page: this.state.page+1});
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
    //validate: values => validate(contactValidationRules, values)
})(ContactAMLCFTForm as any) as any);



interface UnwrappedEditContactAMLCFTProps {
    submit?: (contactId: number, data: React.FormEvent<Form>) => void;
    contactId: number;
    contact?: EL.Resource<EL.Contact>;
}


@(connect(
          undefined,
    {
        submit: (contactId: number, data: React.FormEvent<Form>) => {
            const url = `contacts/amlcft/${contactId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Contact updated.'), (response) => push('/contacts')],
                onFailure: [createNotification('Contact update failed. Please try again.', true)],
            };

            return updateResource(url, data, meta);
        }
    }
) as any)
@ContactHOC()
@PanelHOC<UnwrappedEditContactAMLCFTProps>('AML/CFT Due Diligence Form', props => props.contact)
class UnwrappedEditContactAMLCFT extends React.PureComponent<UnwrappedEditContactAMLCFTProps> {
    render() {
        return <EditContactAMLCFTForm initialValues={this.props.contact.data} onSubmit={data => this.props.submit(this.props.contactId, data)}  />
    }
}




export class EditContactAMLCFT extends React.PureComponent<{ params: { contactId: number; } }> {
    render() {
        return <UnwrappedEditContactAMLCFT contactId={this.props.params.contactId} />
    }
}

@(connect(
          undefined,
    {
        submit: (contactId: number, data: React.FormEvent<Form>) => {
            const url = `contacts/amlcft/${contactId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Contact updated.'), (response) => push('/contacts')],
                onFailure: [createNotification('Contact update failed. Please try again.', true)],
            };

            return updateResource(url, data, meta);
        }
    }
) as any)
@PanelHOC<UnwrappedEditContactAMLCFTProps>('AML/CFT Due Diligence Form')
class UnwrappedExternalContactAMLCFT extends React.PureComponent<UnwrappedEditContactAMLCFTProps> {
    render() {
        return <EditContactAMLCFTForm initialValues={{}} onSubmit={data => this.props.submit(this.props.contactId, data)}  />
    }
}


export class ExternalAMLCFT extends React.PureComponent<{ params: { contactId: number; } }> {
    render() {
        return <UnwrappedExternalContactAMLCFT contactId={this.props.params.contactId} />
    }
}