import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import * as namecase from 'namecase';
console.log(namecase)

interface IInputFieldComponentProps extends IFieldComponentProps {
    type: string;
    readOnly?: boolean;
    placeholder?: string;
    caseButton?: boolean;
}

export default class InputFieldComponent extends React.PureComponent<IInputFieldComponentProps> {
    namecase = () => {
        const input = this.props.input.value;
        if(input && namecase.checkName(input)) {
            this.props.input.onChange(namecase(input));
        }
    }
    render() {
        const input = <FormControl {...this.props.input} componentClass="input" type={this.props.type} placeholder={this.props.placeholder} readOnly={this.props.readOnly}/>;
        const control = this.props.caseButton ? <InputGroup>
            { input }
            <InputGroup.Button>
            <Button onClick={this.namecase}>A<i>a</i></Button>
          </InputGroup.Button>
        </InputGroup> : input;
        return (
            <BaseFieldComponent {...this.props}>
                 { control }
            </BaseFieldComponent>
        );
    }
}