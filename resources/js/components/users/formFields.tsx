import * as React from 'react';
import { Combobox, DatePicker, InputField } from '../form-fields';

/**
 * Basic details
 */
export const basicDetailsValidationRules: EL.IValidationFields = {
    title: { name: 'Title', required: true },

    firstName: { name: 'First name', required: true },
    surname: { name: 'Surname', required: true },
    
    email: { name: 'Email', required: true },

    lawAdmissionDate: { name: 'Law admission date', isDate: true },
    irdNumber: { name: 'IRD number', required: true },
    bankAccountNumber: { name: 'Bank account number', required: true },
};

export class BasicDetailsFormFields extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return (
            <div>
                <Combobox name="title" label="Title" data={["Mr", "Mrs", "Ms"]} />
                    
                <InputField name="firstName" label="First Name" type="text" />
                <InputField name="middleName" label="Middle Name" type="text" />
                <InputField name="surname" label="Surname" type="text" />

                <InputField name="preferredName" label="Preferred Name" type="text" />

                <InputField name="email" label="Email" type="email" />

                <DatePicker name="lawAdmissionDate" label="Law Admission Date" />
                <InputField name="irdNumber" label="IRD Number" type="text" />
                <InputField name="bankAccountNumber" label="Bank Account Number" type="text" />
            </div>
        );
    }
}

/**
 * Emergency Contact
 */
export const emergencyContactValidationRules: EL.IValidationFields = {
    name:  { name: 'Name',  required: true },
    email: { name: 'Email', required: true },
    phone: { name: 'Phone', required: true }
};

export class EmergencyContactFormFields extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return (
            <div>
                <InputField name="name" label="Name" type="text" />
                <InputField name="email" label="Email" type="email" />
                <InputField name="phone" label="Phone" type="text" />
            </div>
        );
    }
}