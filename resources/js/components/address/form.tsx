import * as React from 'react';
import { reduxForm } from 'redux-form';
import { validate } from '../utils/validation';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';
import { InputField } from '../form-fields';
import Autocomplete from 'react-google-autocomplete';
import { Fields as ReduxFields} from 'redux-form';
import BaseFieldComponent, { IFieldComponentProps } from '../form-fields/baseFieldComponent';
import { FormControl } from 'react-bootstrap';

interface IInputFieldComponentProps extends IFieldComponentProps {

}

const mapLocation = (place: {address_components: {long_name: string; types: string[]}[]}) => {
    const types = ['street_number', 'route',  'administrative_area_level_1', 'locality', 'postal_code', 'country'];
    const results = {};
    for(let i = 0; i < place.address_components.length; i++) {
        let comp = place.address_components[i];
        for(let j =0; j<types.length; j++) {
            const type = types[j];
            if(comp.types.includes(type)) {
                results[type] = comp.long_name;
            }
        }
    }
    if(results['street_number'] && results['route']) {
        results['street_address'] = `${results['street_number']} ${results['route']}`;
    }
    else{
        results['street_address'] = results['street_number'] || results['route'];
    }
    return results;
}

const resultMap = {
    'street_address': 'addressOne',
    'sublocality_level_1': 'addressTwo',
    "locality": 'city',
    'administrative_area_level_1': 'state',
    'postal_code': 'postCode',
    'country': 'country'
}


export class AddressLookup extends React.PureComponent<any> {
    select = (place) => {
        const mapped = mapLocation(place);
        Object.keys(mapped).map(m => {
            const key = resultMap[m];
            if(this.props[key]) {
                this.props[key].input.onChange(mapped[m]);
            }
        })
        this.props.placeId.input.onChange(place.place_id);
    }
    render() {
        return (
            <BaseFieldComponent {...this.props.lookup} label={'Lookup'}>
                            <Autocomplete
                            className="form-control"
                        onPlaceSelected={this.select}
                        types={['address']}
                        componentRestrictions={{country: "nz"}}
                    />
            </BaseFieldComponent>
        );
    }
}

interface FieldProps {
    name: string;
    label?: string;
    naked?: boolean;
    showRemoveButton?: boolean;
    onRemoveButtonClick?: () => void;
    required?: boolean;
    help?: JSX.Element;
    placeholder?: string;
}
interface InputFieldProps extends FieldProps {
    type: string;
    readOnly?: boolean;
}


interface IAddressFormProps {
    handleSubmit?: (event: React.FormEvent<typeof Form>) => void;
    onSubmit?: (event: React.FormEvent<typeof Form>) => void;
    initialValues?: any
}

export const validationRules: EL.IValidationFields = {
    addressName: { name: 'Address name',  required: true },
    addressOne: { name: 'Address one',  required: true },
    addressType: { name: 'Address type',  required: true },
    postCode: { name: 'Post code',  required: true },
    country: { name: 'Country',  required: true },
};




export class AddressFields extends React.PureComponent<IAddressFormProps> {
    render(){
        return [
                <ReduxFields key={'addressField'} names={["lookup", "placeId", "addressOne", "addressTwo", "city", "county", "state", "postCode", "country"]} component={AddressLookup}/>,
                <InputField key={"addressOne"} name="addressOne" label="Address Line One" type="text" required />,
                <InputField key={"addressTwo"} name="addressTwo" label="Address Line Two" type="text" />,
                <InputField key={"city"} name="city" label="City" type="text" />,
                /*<InputField key={"county"} name="county" label="County" type="text" />,*/
                <InputField key={"state"} name="state" label="State" type="text" />,
                /*<InputField key={"addressType"} name="addressType" label="Address Type" type="text" required />, */
                <InputField key={"postCode"} name="postCode" label="Post Code" type="text" />,
                <InputField key={"country"} name="country" label="Country" type="text" />
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

                <React.Fragment>
                    <Button variant="primary" className="pull-right" type="submit">Save Address</Button>
                </React.Fragment>
            </Form>
        );
    }
}