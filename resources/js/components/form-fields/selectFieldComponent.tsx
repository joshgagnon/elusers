import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps, NakedBaseFieldComponent } from './baseFieldComponent';
import { FormControl } from 'react-bootstrap';
import { SelectOption } from './index';

interface SelectFieldComponentProps extends IFieldComponentProps {
    options: SelectOption[];
    prompt?: boolean;
    multiple?: boolean;
}

export default class SelectFieldComponent extends React.PureComponent<SelectFieldComponentProps> {
    render() {

        return (
            <BaseFieldComponent {...this.props}>
                <FormControl componentClass="select" placeholder="select" multiple={this.props.multiple} {...this.props.input}>
                { this.props.prompt && <option value="" disabled>Please Select...</option> }
                    { this.props.options.map((opt: SelectOption, index) => {
                        const value = typeof opt === 'string' ? opt : (opt as SelectOption).value;
                        const text = typeof opt === 'string' ? opt : (opt as SelectOption).text;
                        return <option key={ index } value={ value }>{ text }</option>
                    }) }

                </FormControl>
            </BaseFieldComponent>
        );
    }
}