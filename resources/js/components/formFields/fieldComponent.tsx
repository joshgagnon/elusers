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
        const { label, meta: { touched, error } } = this.props;
        const displayError = touched && error;

        return (
            <FormGroup validationState={this.validationState(touched, error)}>
                <ControlLabel>{label}</ControlLabel>
                <div>
                    <FieldFactory {...this.props} />
                    { displayError && <HelpBlock>{error}</HelpBlock>}
                </div>
            </FormGroup>
        );
    }
}

class FieldFactory extends React.PureComponent<IFieldComponentProps, EvolutionUsers.Stateless> {
    componentClass(type: string) {
        switch (type) {
            case 'textarea':
                return type;
            default:
                return 'input';
        }
    }

    render() {
        const { input, type, label, meta: { active } } = this.props;

        switch (this.props.type) {
            case "date":
                return <DatePickerField input={input} />;
            default:
                return <FormControl {...input} componentClass={this.componentClass(type)} type={type} placeholder={label} />;
        }
    }
}