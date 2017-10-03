import * as React from 'react';
import * as moment from 'moment';
import { WrappedFieldInputProps } from 'redux-form';
import { DateTimePicker } from 'react-widgets';
import * as momentLocaliser from 'react-widgets/lib/localizers/moment';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';

momentLocaliser(moment);

export default class DatePickerField extends React.PureComponent<IFieldComponentProps, EL.Stateless> {
    render() {
        const { input: { onChange, onBlur, value } } = this.props;

        return (
            <BaseFieldComponent {...this.props}>
                <DateTimePicker
                    onChange={onChange as any}
                    format="D MMM YYYY"
                    time={false}
                    value={!value ? null : new Date(value)}
                    onBlur={onBlur}
                    className="form-control"
                    ref="date"
                    onFocus={(event: React.FocusEvent<any>) => {
                        const target : any = event.target;
                        const shouldOpen = target.tagName === 'INPUT' && !this.props.value;
                        const widgetInstance = this.refs.date && (this.refs.date as any).getControlledInstance();

                        if (shouldOpen && widgetInstance) {
                            widgetInstance.open("calendar");
                        }
                    }}
                />
            </BaseFieldComponent>
        );
    }
}