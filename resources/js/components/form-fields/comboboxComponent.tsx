import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { Combobox } from 'react-widgets';

interface IComboboxComponentProps extends IFieldComponentProps {
    data: string[];
}

export default class ComboboxComponent extends React.PureComponent<IComboboxComponentProps, EL.Stateless> {
    render() {
        const { data, ...baseFieldComponentProps } = this.props;
        return (
            <BaseFieldComponent {...baseFieldComponentProps}>
                <Combobox {...this.props.input} data={this.props.data} />
            </BaseFieldComponent>
        );
    }
}