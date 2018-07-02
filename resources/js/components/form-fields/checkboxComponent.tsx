import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { Checkbox } from 'react-bootstrap';

interface IInputFieldComponentProps extends IFieldComponentProps {

}

export default class InputFieldComponent extends React.PureComponent<IInputFieldComponentProps> {
    render() {
        return (
            <BaseFieldComponent {...this.props}>
                <Checkbox>
                    { this.props.children }
                </Checkbox>
            </BaseFieldComponent>
        );
    }
}