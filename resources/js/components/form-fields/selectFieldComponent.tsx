import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { FormControl } from 'react-bootstrap';

interface SelectOption {
    value: string;
    text: string;
}

interface SelectFieldComponentProps extends IFieldComponentProps {
    options: SelectOption[];
}

export default class SelectFieldComponent extends React.PureComponent<SelectFieldComponentProps> {
    render() {
        // debugger;
        // this.props.value
        return (
            <BaseFieldComponent {...this.props}>
                <FormControl componentClass="select" placeholder="select" {...this.props.input}>
                    {this.props.options.map((option, index) => <option key={index} value={option.value}>{option.text}</option>)}
                </FormControl>
            </BaseFieldComponent>
        );
    }
}