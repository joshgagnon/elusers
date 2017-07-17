import * as React from 'react';
import * as moment from 'moment';
import { WrappedFieldInputProps } from 'redux-form';
import { DateTimePicker } from 'react-widgets';
import * as momentLocaliser from 'react-widgets/lib/localizers/moment';

momentLocaliser(moment);

interface IDatePickerFieldProps {
     input: WrappedFieldInputProps;
}

export default class DatePickerField extends React.PureComponent<IDatePickerFieldProps, EL.Stateless> {
    render() {
        const { input: { onChange, onBlur, value } } = this.props;

        return (
            <DateTimePicker
                onChange={onChange as any}
                format="D MMM YYYY"
                time={false}
                value={!value ? null : new Date(value)}
                onBlur={onBlur}
                className="form-control"
                ref="date"
                onFocus={(event: React.FocusEvent<any>) => {
                    if (event.target.tagName === 'INPUT' && !this.props.value) {
                        this.refs.date && this.refs.date.getControlledInstance() &&this.refs.date.getControlledInstance().open("calendar");
                    }
                    //this.props.onFocus(event)
                }}
            />
        );
    }
}