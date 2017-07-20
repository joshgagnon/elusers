import * as React from 'react';
import { Field as ReduxField } from 'redux-form';
import ComboboxComponent from './comboboxComponent';
import DatePickerComponent from './datePickerComponent';
import DurationComponent from './durationComponent';
import InputFieldComponent from './inputFieldComponent';

interface IFieldProps {
    name: string;
    label: string;
}

interface IComboboxProps extends IFieldProps {
    data: string[];
}

interface IInputFieldProps extends IFieldProps {
    type: string;
}

export class Combobox extends React.PureComponent<IComboboxProps, EL.Stateless> {
    render() {
        return <ReduxField {...this.props} component={ComboboxComponent} />;
    }
}

export class DatePicker extends React.PureComponent<IFieldProps, EL.Stateless> {
    render() {
        return <ReduxField {...this.props} component={DatePickerComponent} />;
    }
}

export class DurationField extends React.PureComponent<IFieldProps, EL.Stateless> {
    render() {
        return <ReduxField {...this.props} component={DurationComponent} />;
    }
}

export class InputField extends React.PureComponent<IInputFieldProps, EL.Stateless> {
    render() {
        return <ReduxField {...this.props} component={InputFieldComponent} />;
    }
}