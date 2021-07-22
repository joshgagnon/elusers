import * as React from 'react';
import * as moment from 'moment';
import { WrappedFieldInputProps } from 'redux-form';
import { DateTimePicker } from 'react-widgets';
import * as momentLocalizer from 'react-widgets-moment';

import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';

momentLocalizer(moment);


const formats = [
    "D MMMM YYYY",
    "D MMM YYYY",
    "d/MM/YY",
    "YYYY MM DD"
];

export default class DatePickerField extends React.PureComponent<IFieldComponentProps & {defaultView?: string}> {
    render() {
        const { input: { onChange, onBlur, value } } = this.props;
        const Picker = DateTimePicker as any;
        return (
            <BaseFieldComponent {...this.props}>
                <Picker
                    onChange={(date, string) => onChange(string)}
                    
                    format="D MMMM YYYY"
                    time={false}
                    parse={formats}
                    value={!value ? null : new Date(value)}
                    onBlur={() => {
                        onBlur(!value ? null : value)
                    }}
                    ref="date"
                    defaultView={this.props.defaultView}

                    /*onFocus={(event: React.FocusEvent<any> as any) => {
                        const target : any = event.target;
                        const shouldOpen = target.tagName === 'INPUT' && !this.props.value;
                        const widgetInstance = this.refs.date && (this.refs.date as any).getControlledInstance();

                        if (shouldOpen && widgetInstance) {
                            widgetInstance.open("calendar");
                        }
                    }}*/
                />
            </BaseFieldComponent>
        );
    }
}