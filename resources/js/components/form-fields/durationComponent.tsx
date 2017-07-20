import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { fractionalHoursToMinutes, minutesToFractionalHours } from '../utils';
import { FormControl } from 'react-bootstrap';

interface IDurationFieldState {
    fractionalHours: string;
}

const numberRegex = /^$|^(\d+(\.)?(\d{1,2})?)$/;

export default class DurationFieldComponent extends React.PureComponent<IFieldComponentProps, IDurationFieldState> {
    constructor(props: IFieldComponentProps) {
        super(props);

        this.state = {
            fractionalHours: minutesToFractionalHours(this.props.input.value) + ''
        };

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onChange(e: React.ChangeEvent<any>) {
        const newValue = e.target.value;
        
        if (numberRegex.test(newValue)) {
            this.setState({ fractionalHours: newValue });
        }
    }

    onBlur(e: React.ChangeEvent<any>) {
        const totalMinutes = this.state.fractionalHours === '' ? '' : fractionalHoursToMinutes(Number(this.state.fractionalHours || 0));
        this.props.input.onBlur(totalMinutes);
    }

    render() {
        return (
            <BaseFieldComponent {...this.props} >
                <FormControl value={this.state.fractionalHours} componentClass="input" type="text" onChange={this.onChange} onBlur={this.onBlur} />
            </BaseFieldComponent>
        );
    }
}