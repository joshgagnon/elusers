import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { Form } from 'react-bootstrap';

interface IInputFieldComponentProps extends IFieldComponentProps {

}

export default class InputFieldComponent extends React.PureComponent<IInputFieldComponentProps> {
    render() {
        return (
            <BaseFieldComponent {...this.props}>
                <Form.Check {...this.props.input} checked={this.props.input.value ? true : false}>
                    { this.props.children }
                </Form.Check>
            </BaseFieldComponent>
        );
    }
}