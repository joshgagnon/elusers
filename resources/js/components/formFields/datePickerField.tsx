import * as React from 'react';
import * as moment from 'moment';
import { FormControl } from 'react-bootstrap';
import { WrappedFieldInputProps } from 'redux-form';
import { SingleDatePicker, DayPickerSingleDateController } from 'react-dates';

interface IDatePickerFieldProps {
     input: WrappedFieldInputProps;
}

export default class DatePickerField extends React.PureComponent<IDatePickerFieldProps, {}> {
    render() {
        const { onChange, onFocus } = this.props.input;
        const value = this.props.input.value || moment();

        return (
            <div>
                <FormControl componentClass="input" type="text" value={value.format('D MMM YYYY')} />

                <DayPickerSingleDateController
                    numberOfMonths={1}
                    date={value}
                    onDateChange={onChange}
                    onFocusChange={onFocus}
                    showInput={false}
                    hideKeyboardShortcutsPanel={true}
                />
            </div>
        );
    }
}