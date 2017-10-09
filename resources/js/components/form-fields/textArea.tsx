import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { FormControl } from 'react-bootstrap';

export default class TextArea extends React.PureComponent<IFieldComponentProps> {
    render() {
        return (
            <BaseFieldComponent {...this.props}>
                <FormControl {...this.props.input} componentClass="textarea" rows={4} />
            </BaseFieldComponent>
        );
    }
}