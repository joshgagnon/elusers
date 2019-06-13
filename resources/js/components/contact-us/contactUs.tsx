import * as React from 'react';
import { ContactsHOC, ContactHOC, ClientRequestTokenHOC } from '../hoc/resourceHOCs';
import WaitForResource from '../hoc/waitForResource';
import Table from '../dataTable';
import PanelHOC from '../hoc/panelHOC';
import { Form, ButtonToolbar, Button, ProgressBar } from 'react-bootstrap';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';
import { reduxForm, formValueSelector, InjectedFormProps, FormSection, FieldArray, getFormValues } from 'redux-form';
import { validate } from '../utils/validation';
import { fullname } from '../utils';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Icon from '../icon';
import { connect } from 'react-redux';
import { createNotification, createResource, updateResource, deleteResource, confirmAction } from '../../actions';
import MapParamsToProps from '../hoc/mapParamsToProps';
import { AddressFields, validationRules as addressValidationRules } from '../address/form';
import { MATTER_TYPES } from '../matters';
import { ContactInformationFields } from '../contact-information/contactInformation';

/*
What is your full legal name?
By what name do you prefer to be addressed?
Are you completing this form for yourself, another individual, or an organisation?
[If another individual]:
• What is the other person’s full legal name?
• In what capacity are you completing this form for the other person? [Authorised Person, Attorney, Other – Please State]
[if an organisation]
• What is the organisation’s full legal name?
• What type of organisation is it? [Company, Partnership, Trust, Other – Please State]
• In what capacity are you completing this form for the organisation? [Authorised Person, Attorney, Director, Partner, Trustee, Other – Please State]
[if company]
• What is the company number?
[Save Progress][Next]


[THIRD SCREEN OF FORM]
Tell us what you need
What type of legal services do you need? [Options are ELF Matter types but add “Don’t Know” as first option]
[If Conveyancing matter types chosen]
• What is the address of the relevant property?
Briefly describe what you would like to achieve: [Max word limit 1,000 words]
[Save Progress][Next]


[FOURTH SCREEN OF FORM]
Let us know how to contact you
What is your email address?
What is your mobile phone number?
[If “Yourself” chosen in screen one]What is your residential address?
[If “Another Person” chosen in screen one]What is the other person’s residential address?
[If “Organisation - Company” chosen in screen one]What is the registered office of the company?
[If any other “Organisation” chosen in screen one]What is the physical address of the organisation?
[Save Progress][Next]



[FIFTH SCREEN OF FORM]
Upload your documents
Upload any supporting documents that you would like us to review.
We may require proof of your identity and residential address before being able to act. To avoid unnecessary delay, we recommend uploading a copy of your
photo identification and a recent utilities bill showing your residential address.

*/




interface ContactFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    saveButtonText: string;
    token: string;
    values: () => any;
    save: (token: string, values: any) => void;
    form: string;
}

//<DatePicker name="contactable.dateOfBirth" label="Date of Birth" defaultView="decade" />

const ExternalContactFields = [
    (props: {capacity?: string; capacityType?: string; organisationType?: string;}) => {

        return <React.Fragment>
            <h4 className={"text-center"}>Tell us a little bit about yourself</h4>

                <p className="form-question">What is your full legal name?</p>
                <InputField name="contactable.firstName" label="First Name" type="text" required/>
                <InputField name="contactable.middleName" label="Middle Name" type="text" />
                <InputField name="contactable.surname" label="Surname" type="text" required />
                <p className="form-question">By what name do you prefer to be addressed?</p>
                <InputField name="contactable.preferredName" label="Preferred Name" type="text" required />
                <p className="form-question">Are you completing this form for yourself, another individual, or an organisation?</p>

                <SelectField name="capacity" label="Capacity" options={['Myself', 'Another Individual', 'An Organisation']} required prompt/>

                { props.capacity === 'Another Individual' && <React.Fragment>
                    <p className="form-question">What is the other person’s full legal name?</p>
                    <InputField name="otherIndividual.firstName" label="First Name" type="text" required/>
                    <InputField name="otherIndividual.middleName" label="Middle Name" type="text" />
                    <InputField name="otherIndividual.surname" label="Surname" type="text" required />

                    <p className="form-question">In what capacity are you completing this form for the other person?</p>
                    <SelectField name="capacityType" label="Capacity Type" options={['Authorised Person', 'Attorney', 'Other']} required prompt/>
                    { props.capacityType === 'Other' && <InputField name="otherIndividual.capacityType"
                        label="Description" placeholder={'Please describe...'} type="text" required />  }
                </React.Fragment> }

                { props.capacity === 'An Organisation' && <React.Fragment>
                    <p className="form-question">What is the organisation’s full legal name?</p>
                    <InputField name="otherOrganisation.name" label="Name" type="text" required/>
                    <SelectField name="organisationType" label="Organisation Type" options={['Company', 'Partnership', 'Trust', 'Other']} required prompt/>

                    { props.organisationType === 'Company' && <React.Fragment>
                        <InputField type="text" name="otherOrganisation.companyNumber" label="Company Number"/>
                    </React.Fragment> }

                    <p className="form-question">In what capacity are you completing this form for the organisation?</p>
                    <SelectField name="capacityType" label="Capacity Type" options={['Authorised Person', 'Attorney', 'Director', 'Partner', 'Trustee', 'Other']} required prompt/>
                    { props.capacityType === 'Other' && <InputField name="otherOrganisation.capacityType"
                        label="Description" placeholder={'Please describe...'} type="text" required />  }

                </React.Fragment> }


        </React.Fragment>
    },

    (props: {requiresAddress: boolean;}) => {
        const matterOptions = ["Don't Know", ...MATTER_TYPES].map(matter => {
            return {value: matter, text: matter};
        });
        return <React.Fragment>
            <p className="form-question">What type of legal services do you need?</p>
            <FormSection name="matter">
            <SelectField name="matterType" label="Matter Type" options={matterOptions} required prompt/>
                { props.requiresAddress && <React.Fragment>
                          <h4 className={"text-center"}>What is the address of the relevant property?</h4>
                        <AddressFields />
                   </React.Fragment>}
              <p className="form-question">Please provide a brief description of the matter</p>
              <TextArea name="description" label="Description" required />
              </FormSection>
        </React.Fragment>
    },
    () => {
        return <React.Fragment>
            <h4 className={"text-center"}>Contact Information</h4>
                <FormSection name="contact">
              <FieldArray name="contactInformations" component={ContactInformationFields as any} selector={formValueSelector(EL.FormNames.CONTACT_US_FORM)} />
              </FormSection>
            <FormSection name="address.data">
                <AddressFields />
            </FormSection>
        </React.Fragment>
    },

    () => {
        return <React.Fragment>
            <h4 className={"text-center"}>Upload your documents</h4>
            <p className="form-question">Upload any supporting documents that you would like us to review.</p>
            <p className="form-question">We may require proof of your identity and residential address before being able to act. To avoid unnecessary delay, we recommend uploading a copy of your
photo identification and a recent utilities bill showing your residential address.</p>
            <br/>
            <DocumentList name="files" label="Documents" />
        </React.Fragment>
    },


]

@(reduxForm({
    form: EL.FormNames.CONTACT_US_FORM,
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true,
}) as any)
@(connect((state: EL.State) => formValueSelector(EL.FormNames.CONTACT_US_FORM)(state, 'capacity', 'capacityType', 'organisationType')) as any)
class ContactPage1 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void, capacity?: string; capacityType?: string; organisationType?: string}> {
    fields = ExternalContactFields[0]
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
            <Fields capacity={this.props.capacity} capacityType={this.props.capacityType} organisationType={this.props.organisationType}/>
            { this.props.children }
        </Form>
    }
}

@(reduxForm({
    form: EL.FormNames.CONTACT_US_FORM,
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true,
}) as any)
class ContactPage2 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void}> {
    fields = ExternalContactFields[1]
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
    form: EL.FormNames.CONTACT_US_FORM,
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true,
}) as any)
@(connect((state, ownProps) => ({
    requiresAddress: ['Conveyancing – Sale / Purchase','Conveyancing – Refinance']
        .includes(formValueSelector(EL.FormNames.CONTACT_US_FORM)(state, 'matter.matterType'))
})) as any)
class ContactPage3 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void, requiresAddress?: boolean}> {
    fields = ExternalContactFields[2]
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
            <Fields requiresAddress={this.props.requiresAddress}/>
            { this.props.children }
        </Form>
    }
}

@(reduxForm({
    form: EL.FormNames.CONTACT_US_FORM,
     destroyOnUnmount: false,
     forceUnregisterOnUnmount: true,
}) as any)
class ContactPage4 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void}> {
    fields = ExternalContactFields[3]
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
            <Fields/>
            { this.props.children }
        </Form>
    }
}


@(connect((state, ownProps: any) => ({
    values: () => getFormValues(ownProps.form)(state),
}), {
    save: (token: string, data: React.FormEvent<Form>) => {
        const url = `client_request/${token}`;
        const meta: EL.Actions.Meta = {
            onSuccess: [createNotification('Progress saved.')],
            onFailure: [createNotification('Progress saving failed. Please try again.', true)],
        };

        return updateResource(url, data, meta);
    }
}) as any)
class ContactUsForm extends React.PureComponent<ContactFormProps, {page: number}> {
    state = {page: 0};
    pages=[
        ContactPage1,
        ContactPage2,
        ContactPage3,
        ContactPage4
    ];
    controls() {
        return <div className="button-row">
            <Button bsStyle="info" onClick={this.save} >Save Progress</Button>
            { this.state.page > 0 && <Button onClick={() => this.setState({page: this.state.page-1})}>Back</Button>}
            { this.state.page < this.pages.length - 1  && <Button  bsStyle="primary" type="submit">Next</Button>}
            { this.state.page == this.pages.length - 1 && <Button bsStyle="primary" type="submit">Submit</Button> }
        </div>
    }

    submit(values) {
        this.props.onSubmit(values);
    }

    save = () => {
        this.props.save(this.props.token, this.props.values());
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

const EditContactUsForm = (reduxForm({
    form: EL.FormNames.CONTACT_US_FORM,
    /*validate: (values: any) : EL.ValidationErrors => ({
        contactable: validate({
            firstName: { name: 'First Name', required: true },
            surname: { name: 'Surname', required: true }
      }, values.contactable || {})}),*/
})(ContactUsForm as any) as any);

interface ExternalContactProps {
    clientRequest: EL.Resource<EL.ClientRequest>
}

@MapParamsToProps(['token'])
@ClientRequestTokenHOC({name: 'clientRequest'})
@PanelHOC<ExternalContactProps>('New Client Form', props => props.clientRequest)
export class ExternalContact extends React.PureComponent<{clientRequest: EL.Resource<EL.ClientRequest>, token: string}> {
    render() {
        const values = this.props.clientRequest.data;
        return <EditContactUsForm initialValues={values} token={this.props.token} onSubmit={data => {}}  />
    }
}

