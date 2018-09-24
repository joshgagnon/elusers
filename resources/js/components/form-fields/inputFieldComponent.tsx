import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { FormControl } from 'react-bootstrap';

interface IInputFieldComponentProps extends IFieldComponentProps {
    type: string;
    readOnly?: boolean;
    placeholder?: string;
}

export default class InputFieldComponent extends React.PureComponent<IInputFieldComponentProps> {
    render() {
        return (
            <BaseFieldComponent {...this.props}>
                <FormControl {...this.props.input} componentClass="input" type={this.props.type} placeholder={this.props.placeholder} readOnly={this.props.readOnly}/>
            </BaseFieldComponent>
        );
    }
}