import * as React from 'react';
import { ContactsHOC, ContactHOC, ClientRequestTokenHOC } from '../hoc/resourceHOCs';
import WaitForResource from '../hoc/waitForResource';
import Table from '../dataTable';
import PanelHOC from '../hoc/panelHOC';
import { Form, ButtonToolbar, Button, ProgressBar, Col, FormGroup, ControlLabel, Alert } from 'react-bootstrap';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';
import { reduxForm, formValueSelector, InjectedFormProps, FormSection, FieldArray, getFormValues } from 'redux-form';
import { validate } from '../utils/validation';
import { fullname } from '../utils';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Icon from '../icon';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createNotification, createResource, updateResource, deleteResource, confirmAction } from '../../actions';
import MapParamsToProps from '../hoc/mapParamsToProps';
import { AddressFields, validationRules as addressValidationRules } from '../address/form';
import { MATTER_TYPES } from '../matters';
import { ContactInformationFields } from '../contact-information/contactInformation';


class OtherIndividuals extends React.PureComponent<{fields: any, meta: any }> {
    render() {
        const { fields } = this.props;
        return <div>
            { fields.map((person, index) => (
              <div key={index}>
                <FormGroup className="no-margin">
                    <Col componentClass={ControlLabel} md={3}>
                         Other Individual #{index+1}
                    </Col>
                    <Col md={8}>
                        <InputField name={`${person}.firstName`} label="First Name" type="text" required caseButton />
                        <InputField name={`${person}.middleName`} label="Middle Name" type="text" caseButton />
                        <InputField name={`${person}.surname`} label="Surname" type="text" required caseButton />
                    </Col>

                    <Col md={1}>
                        <Button className="btn-icon-only" onClick={(e) => {
                                e.preventDefault();
                                fields.remove(index)
                              }}><Icon iconName="trash-o" /></Button>
                    </Col>
                    </FormGroup>

                      { index !== fields.length -1  && <hr /> }
              </div>
            )) }
              <div className="button-row">
                  <Button onClick={() => fields.push({})}>
                Add Another Individual
                </Button>
            { this.props.meta.error && <Alert bsStyle="danger">
                <p className="text-center">
                { this.props.meta.error }
                </p>
            </Alert> }
              </div>
          </div>
    }
}


const FIND_OUT_OPTIONS = [
    'Google Search',
    'Referral',
    'Other'
]


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
    (props: {capacity?: string; capacityType?: string; organisationType?: string; howDidYouFindUs?: string, caseButton?: boolean}) => {

        return <React.Fragment>
                <h4 className={"text-center"}>Tell us a little bit about yourself</h4>
                <FormSection name="contact">
                    <p className="form-question">What is your full legal name?</p>
                    <InputField name="contactable.firstName" label="First Name" type="text" required caseButton={props.caseButton} />
                    <InputField name="contactable.middleName" label="Middle Name" type="text" caseButton={props.caseButton} />
                    <InputField name="contactable.surname" label="Surname" type="text" required caseButton={props.caseButton} />
                    <p className="form-question">By what name do you prefer to be addressed?</p>
                    <InputField name="contactable.preferredName" label="Preferred Name" type="text" required caseButton={props.caseButton} />
                </FormSection>
                <p className="form-question">Are you completing this form for yourself, yourself and others, another individual, or an organisation?</p>

                <SelectField name="capacity" label="Capacity" options={['Myself', 'Myself and Others', 'Other Individuals', 'An Organisation']} required prompt/>

                { props.capacity === 'Myself and Others' && <React.Fragment>
                    <p className="form-question">What are the other person’s full legal names?</p>
                    <FieldArray name="otherIndividuals" component={OtherIndividuals} />
                    </React.Fragment> }

                { props.capacity === 'Other Individuals' && <React.Fragment>
                    <p className="form-question">What are the other person’s full legal names?</p>
                    <FieldArray name="otherIndividuals" component={OtherIndividuals} />

                    <p className="form-question">In what capacity are you completing this form for the other person(s)?</p>
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

                <p className="form-question">How did you find out about Evolution Lawyers?</p>

                <SelectField name="howDidYouFindUs" label="Method" options={FIND_OUT_OPTIONS} prompt/>

                { props.howDidYouFindUs === 'Referral' &&  <InputField name="referrer" label="Name of Referrer" type="text" /> }
                { props.howDidYouFindUs === 'Other' &&  <InputField name="findOutOther" label="Description" type="text" /> }

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
                          <p className="form-question">What is the address of the relevant property?</p>
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

                 <InputField name="emailSimple" label="Email" type="text" required />
                 <InputField name="phoneNumberSimple" label="Phone Number" type="text" required />
                 <p className="form-question">Residential Address</p>
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
@(connect((state: EL.State) => formValueSelector(EL.FormNames.CONTACT_US_FORM)(state, 'capacity', 'capacityType', 'organisationType', 'howDidYouFindUs')) as any)
class ContactPage1 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void, capacity?: string;
    capacityType?: string; organisationType?: string, howDidYouFindUs?: string, caseButton?: boolean}> {
    fields = ExternalContactFields[0]
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
            <Fields capacity={this.props.capacity} capacityType={this.props.capacityType}
            organisationType={this.props.organisationType}
            howDidYouFindUs={this.props.howDidYouFindUs}
            caseButton={this.props.caseButton}
            />
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
    requiresAddress: ['Conveyancing – Sale / Purchase', 'Conveyancing – Refinance']
        .includes(formValueSelector(EL.FormNames.CONTACT_US_FORM)(state, 'matter.matterType'))
})) as any)
class ContactPage2 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void, requiresAddress?: boolean, caseButton?: boolean}> {
    fields = ExternalContactFields[1]
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
            <Fields requiresAddress={this.props.requiresAddress}
            caseButton={this.props.caseButton} />
            { this.props.children }
        </Form>
    }
}

@(reduxForm({
    form: EL.FormNames.CONTACT_US_FORM,
      destroyOnUnmount: false,
      forceUnregisterOnUnmount: true,
}) as any)
class ContactPage3 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void, caseButton?: boolean}> {
    fields = ExternalContactFields[2]
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
            <Fields caseButton={this.props.caseButton}/>
            { this.props.children }
        </Form>
    }
}

@(reduxForm({
    form: EL.FormNames.CONTACT_US_FORM,
     destroyOnUnmount: false,
     forceUnregisterOnUnmount: true,
}) as any)
class ContactPage4 extends React.PureComponent<InjectedFormProps & { previousPage?: () => void, caseButton?: boolean}> {
    fields = ExternalContactFields[3]
    render(){
        const { handleSubmit, pristine, previousPage, submitting } = this.props;
        const Fields = this.fields;
        return <Form horizontal onSubmit={handleSubmit}>
            <Fields caseButton={this.props.caseButton}/>
            { this.props.children }
        </Form>
    }
}


@(connect((state, ownProps: any) => ({
    values: () => getFormValues(ownProps.form)(state),
}), {
    save: (token: string, data: React.FormEvent<Form>) => {
        const url = `client-requests/${token}`;
        const meta: EL.Actions.Meta = {
            onSuccess: [createNotification('Progress saved, you can bookmark this page to return later.')],
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


class ReviewContactUs extends React.PureComponent {
    pages=[
        ContactPage1,
        ContactPage2,
        ContactPage3,
        ContactPage4
    ];

    render() {
        return <React.Fragment>
            { this.pages.map((page, i) => {
                const Page = page as any;
                return <React.Fragment key={i}>
                    <Page  caseButton={true}/>
                    <hr/>
                </React.Fragment>
            })}
        </React.Fragment>
    }
}

const validateContact = (values: any) => {
    return {
        contactable: validate({
            firstName: { name: 'First Name', required: true },
            surname: { name: 'Surname', required: true },
      }, values.contactable || {})
    };
}

const validateContactUs = (values: any) : EL.ValidationErrors => {
        return {
            contact: validateContact(values.contact),
            ...validate({
                capacity: { name: 'Capacity', required: true },
                emailSimple: { name: 'Email', required: true},
                phoneNumberSimple: { name: 'Email', required: true},
            }, values)
        };
}

const EditContactUsForm = (reduxForm({
    form: EL.FormNames.CONTACT_US_FORM,
    validate: validateContactUs})(ContactUsForm as any) as any);

export const ReviewContactUsForm = (reduxForm({
    form: EL.FormNames.CONTACT_US_FORM,
    validate: validateContactUs})(ReviewContactUs as any) as any);


interface ExternalContactProps {
    clientRequest: EL.Resource<EL.ClientRequest>
}

const CONTACT_COMPLETE_URL = 'https://evolutionlawyers.nz/new-client-complete';

@MapParamsToProps(['token'])
@(connect(undefined, (dispatch, ownProps: {token: string}) => ({
    submit: bindActionCreators((values) => {
        values['submitted'] = true;
        const url = `client-requests/${ownProps.token}`;
        const meta: EL.Actions.Meta = {
            onSuccess: [(response) => window.location.href = CONTACT_COMPLETE_URL],
            onFailure: [createNotification('Request submission failed. Please try again.', true)],
        };

        return updateResource(url, values, meta);
    }, dispatch)
})) as any)
@ClientRequestTokenHOC({name: 'clientRequest', cache: true})
@PanelHOC<ExternalContactProps>('New Client Form', props => props.clientRequest, {
    errorComponent: () => <div>Saved data could not be found.  Click <a href="/contact-us">here</a> to start a new enquiry.</div>
})
export class ExternalContact extends React.PureComponent<{clientRequest: EL.Resource<EL.ClientRequest>, token: string, submit: (any) => void}> {
    render() {
        let values = this.props.clientRequest.data as any;
        if(!values.contact){
            values = {
                contact: {
                    contactableType: EL.Constants.INDIVIDUAL,
                    contactInformations: [{

                    }]
                }
            }
        }
        return <EditContactUsForm initialValues={values} token={this.props.token} onSubmit={this.props.submit}  />
    }
}



@PanelHOC('New Client Form')
export class ExternalContactComplete extends React.PureComponent {
    render() {
        return <div>
            <p>Thank you for your submission.</p>
            <p>We will review the information and documents provided and get back to you shortly.  We aim to answer all new client requests within one business day. </p>
            <p>If you wish to add to or follow up your submission, please contact us by email
            at <a href="mailto:mail@evolutionlawyers.nz">mail@evolutionlawyers.nz</a> or call us on <a href="tel:0800352993">0800 352 993.</a></p>

            <p>To return to our website, click <a href="https://evolutionlawyers.nz">here</a></p>
        </div>
    }
}