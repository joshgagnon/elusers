import * as React from 'react';
import { reduxForm } from 'redux-form';
import { validate } from '../utils/validation';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';
import { InputField } from '../form-fields';

interface IAddressFormProps {
    handleSubmit?: (event: React.FormEvent<Form>) => void;
    onSubmit: (event: React.FormEvent<Form>) => void;
    initialValues?: any
}

const validationRules: EL.IValidationFields = {
    addressName: { name: 'Address name',  required: true },
    addressOne: { name: 'Address one',  required: true },
    addressType: { name: 'Address type',  required: true },
    postCode: { name: 'Post code',  required: true },
    countryCode: { name: 'Country code',  required: true },
};

@(reduxForm({ form: 'address-form', validate: (values) => validate(validationRules, values) }) as any)
export default class AddressForm extends React.PureComponent<IAddressFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit}  horizontal>
                <InputField name="addressName" label="Address Name" type="text" required />
                <InputField name="addressOne" label="Address One" type="text" required />
                <InputField name="addressTwo" label="Address Two" type="text" />
                <InputField name="addressThree" label="Address Three" type="text" />
                <InputField name="addressType" label="Address Type" type="text" required />
                <InputField name="postCode" label="Post Code" type="text" required />
                <InputField name="countryCode" label="Country Code" type="text" required />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Save Address</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}