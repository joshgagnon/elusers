import * as React from 'react';
import { Field, WrappedFieldInputProps, ComponentConstructor, WrappedFieldProps } from 'redux-form';
import { FormGroup, ControlLabel, HelpBlock, FormControl } from 'react-bootstrap';
import DatePickerField from './datePickerField';

interface IFieldComponentProps extends WrappedFieldProps<string> {
    label: string;
    type: string;
}

export default class FieldComponent extends React.PureComponent<IFieldComponentProps, EvolutionUsers.Stateless> {
    validationState(touched: boolean, error: string) {
        if (!touched) {
            return null;
        }

        return error ? 'error' : 'success';
    }

    render() {
        const { input, label, type, meta: { touched, error, warning } } = this.props;
        const displayError = touched && error;

        return (
            <FormGroup validationState={this.validationState(touched, error)}>
                <ControlLabel>{label}</ControlLabel>
                <div>
                    <FieldFactory type={type} input={input} placeholder={label}/>
                    { displayError && <HelpBlock>{error}</HelpBlock>}
                </div>
            </FormGroup>
        );
    }
}

interface IFieldFactoryProps {
    type: string;
    input: WrappedFieldInputProps;
    placeholder: string;
}

class FieldFactory extends React.PureComponent<IFieldFactoryProps, {}> {
    componentClass(type: string) {
        switch (type) {
            case 'textarea':
                return type;
            default:
                return 'input';
        }
    }

    render() {
        const { input, type, placeholder } = this.props;

        switch (this.props.type) {
            case "date":
                return <DatePickerField input={input} />;
                // return <h1>here</h1>;
            default:
                return <FormControl {...input} componentClass={this.componentClass(type)} type={type} placeholder={placeholder} />;
        }
    }
}