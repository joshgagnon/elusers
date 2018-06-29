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


export class AddressFields extends React.PureComponent<IAddressFormProps> {
    render(){
        return [
                <InputField key={"addressOne"} name="addressOne" label="Address One" type="text" required />,
                <InputField key={"addressTwo"} name="addressTwo" label="Address Two" type="text" />,
                <InputField key={"city"} name="city" label="City" type="text" />,
                <InputField key={"county"} name="county" label="County" type="text" />,
                <InputField key={"state"} name="state" label="State" type="text" />,
                <InputField key={"addressType"} name="addressType" label="Address Type" type="text" required />,
                <InputField key={"postCode"} name="postCode" label="Post Code" type="text" required />,
                <InputField key={"country"} name="country" label="Country" type="text" required />
                ]
    }
}


@(reduxForm({ form: 'address-form', validate: (values) => validate(validationRules, values) }) as any)
export default class AddressForm extends React.PureComponent<IAddressFormProps> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit}  horizontal>
                <InputField name="addressName" label="Address Name" type="text" required />
                <AddressFields {...this.props} />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Save Address</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}