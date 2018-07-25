import * as React from 'react';
import { Field as ReduxField } from 'redux-form';
import ComboboxComponent from './comboboxComponent';
import DropdownComponent from './dropdownComponent';
import DatePickerComponent from './datePickerComponent';
import DurationComponent from './durationComponent';
import InputFieldComponent from './inputFieldComponent';
import SelectFieldComponent from './selectFieldComponent';
import TextAreaComponent from './textArea';
import DocumentComponent from './documents';
import CheckboxComponent from './checkboxComponent';

interface FieldProps {
    name: string;
    label?: string;
    naked?: boolean;
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
    readOnly?: boolean;
}

export interface SelectOption {
    value: number | string;
    text: string;
}

interface SelectFieldProps extends FieldProps {
    options: SelectOption[] | string[];
    prompt?: boolean;
}

interface DropdownListProps extends FieldProps {
    data: any;
    textField: string | ((any) => string);
    valueField: string | ((any) => string);
    placeholder?: string;
    busy?: boolean;
    allowCreate?: boolean | string;
    onCreate?: (value: string) => void;
}

export class Combobox extends React.PureComponent<ComboboxProps> {
    render() {
        return <ReduxField {...this.props} component={ComboboxComponent as any} />
    }
}

export class DatePicker extends React.PureComponent<FieldProps & {defaultView?: string}> {
    render() {
        return <ReduxField  {...this.props} component={DatePickerComponent as any} />
    }
}

export class DurationField extends React.PureComponent<FieldProps> {
    render() {
        return <ReduxField {...this.props} component={DurationComponent as any} />
    }
}

export class InputField extends React.PureComponent<InputFieldProps> {
    render() {
        return <ReduxField {...this.props} component={InputFieldComponent as any} />
    }
}

export class SelectField extends React.PureComponent<SelectFieldProps> {
    render() {
        return <ReduxField {...this.props} component={SelectFieldComponent as any} />
    }
}

export class TextArea extends React.PureComponent<FieldProps> {
    render() {
        return <ReduxField {...this.props} component={TextAreaComponent as any} />
    }
}


export class DocumentList extends React.PureComponent<FieldProps> {
    render() {
        return <ReduxField {...this.props} component={DocumentComponent} />
    }
}


export class DropdownListField extends React.PureComponent<DropdownListProps> {
    render() {
        return <ReduxField {...this.props} component={DropdownComponent as any} />
    }
}

export class CheckboxField extends React.PureComponent<FieldProps> {
    render() {
        return <ReduxField {...this.props} component={CheckboxComponent as any} />
    }
}