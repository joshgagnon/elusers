import * as React from 'react';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { Combobox, DatePicker, InputField } from '../form-fields';
import { reduxForm } from 'redux-form';
import PanelHOC from '../hoc/panelHOC';
import { connect, Dispatch } from 'react-redux';
import { validate } from '../utils/validation';
import { updateResource } from '../../actions'

interface IBasicDetailsProps {
    submit: (event: React.FormEvent<Form>, user: EL.User) => void;
    user: EL.User;
}

interface IBasicDetailsFormProps {
    user: EL.User;
    handleSubmit: (data: React.FormEvent<Form>) => void;
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        submit: (event: React.FormEvent<Form>, user: EL.User) => {
            const url = `users/${user.id}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [ ] // TODO: add notification here
            };

            dispatch(updateResource(url, event, meta));
        }
    };
}

@connect((state: EL.State) => ({ user: state.user }), mapDispatchToProps)
@PanelHOC('Basic Details')
export default class BasicDetails extends React.PureComponent<IBasicDetailsProps, EL.Stateless> {
    render() {
        return (
            <BasicDetailsForm onSubmit={(event: React.FormEvent<Form>) => this.props.submit(event, this.props.user)} initialValues={this.props.user} />
        );
    }
}

const validationRules: EL.IValidationFields = {
    // title: { name: 'Title', required: true, maxLength: 255 },

    firstName: { name: 'First name', required: true, maxLength: 255 },
    middleName: { name: 'Middle name', required: true, maxLength: 255 },
    surname: { name: 'Surname', required: true, maxLength: 255 },
    
    email: { name: 'Email', required: true, maxLength: 255 },

    lawAdmissionDate: { name: 'Law admission date', required: true, isDate: true },
    irdNumber: { name: 'IRD number', required: true, maxLength: 255, isIRDNumber: true },
    bankAccountNumber: { name: 'Bank account number', required: true, maxLength: 255, isBankAccountNumber: true },
};

@reduxForm({ form: 'user-form', validate: values => validate(validationRules, values) })
class BasicDetailsForm extends React.PureComponent<IBasicDetailsFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={ this.props.handleSubmit } horizontal>
                <Combobox name="title" label="Title" data={["Mr", "Mrs", "Ms"]} />
                
                <InputField name="firstName" label="First Name" type="text" />
                <InputField name="middleName" label="Middle Name" type="text" />
                <InputField name="surname" label="Surname" type="text" />

                <InputField name="preferredName" label="Preferred Name" type="text" />

                <InputField name="email" label="Email" type="email" />

                <DatePicker name="lawAdmissionDate" label="Law Admission Date" />
                <InputField name="irdNumber" label="IRD Number" type="text" />
                <InputField name="bankAccountNumber" label="Bank Account Number" type="text" />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Save</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}