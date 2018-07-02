import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { FormControl } from 'react-bootstrap';
import { SelectOption } from './index';

interface SelectFieldComponentProps extends IFieldComponentProps {
    options: SelectOption[];
    prompt?: boolean;
}

export default class SelectFieldComponent extends React.PureComponent<SelectFieldComponentProps> {
    render() {
        return (
            <BaseFieldComponent {...this.props}>
                <FormControl componentClass="select" placeholder="select" {...this.props.input}>
                { this.props.prompt && <option value="" disabled>Please Select...</option> }
                    {this.props.options.map((option, index) => <option key={index} value={option.value}>{option.text}</option>)}

                </FormControl>
            </BaseFieldComponent>
        );
    }
}