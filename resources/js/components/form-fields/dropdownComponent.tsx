import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import * as DropdownList from 'react-widgets/lib/DropdownList';


interface IDropdownComponentProps extends IFieldComponentProps {
    data: any;
    textField: string | ((any) => string);
    valueField: string | ((any) => string);
    placeholder?: string;
}


export default class DropdownComponent extends React.PureComponent<IDropdownComponentProps> {
    render() {
        const { data, ...baseFieldComponentProps } = this.props;
        const List = DropdownList  as any;
        return (
            <BaseFieldComponent {...baseFieldComponentProps}>
                <List {...this.props.input} data={this.props.data} textField={this.props.textField} placeholder={this.props.placeholder}
                valueField={this.props.valueField}
                onChange={o => this.props.input.onChange(o[this.props.valueField as string] )}
                filter/>
            </BaseFieldComponent>
        );
    }
}