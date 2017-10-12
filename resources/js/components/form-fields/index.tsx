import * as React from 'react';
import { Field as ReduxField } from 'redux-form';
import ComboboxComponent from './comboboxComponent';
import DatePickerComponent from './datePickerComponent';
import DurationComponent from './durationComponent';
import InputFieldComponent from './inputFieldComponent';
import SelectFieldComponent from './selectFieldComponent';
import TextAreaComponent from './textArea';

interface FieldProps {
    name: string;
    label: string;
    showRemoveButton?: boolean;
    onRemoveButtonClick?: () => void;
    required?: boolean;
    help?: JSX.Element;
}

interface ComboboxProps extends FieldProps {
    data: string[];
}

interface InputFieldProps extends FieldProps {
    type: string;
}

export interface SelectOption {
    value: number | string;
    text: string;
}

interface SelectFieldProps extends FieldProps {
    options: SelectOption[];
}

export class Combobox extends React.PureComponent<ComboboxProps> {
    render() {
        return <ReduxField {...this.props} component={ComboboxComponent} />
    }
}

export class DatePicker extends React.PureComponent<FieldProps> {
    render() {
        return <ReduxField {...this.props} component={DatePickerComponent} />
    }
}

export class DurationField extends React.PureComponent<FieldProps> {
    render() {
        return <ReduxField {...this.props} component={DurationComponent} />
    }
}

export class InputField extends React.PureComponent<InputFieldProps> {
    render() {
        return <ReduxField {...this.props} component={InputFieldComponent} />
    }
}

export class SelectField extends React.PureComponent<SelectFieldProps> {
    render() {
        return <ReduxField {...this.props} component={SelectFieldComponent} />
    }
}

export class TextArea extends React.PureComponent<FieldProps> {
    render() {
        return <ReduxField {...this.props} component={TextAreaComponent} />
    }
}