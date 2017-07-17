import * as React from 'react';
import { FormControl } from 'react-bootstrap';
import { WrappedFieldInputProps } from 'redux-form';
import { fractionalHoursToMinutes, minutesToFractionalHours } from '../utils';

interface IDurationFieldProps {
    input: WrappedFieldInputProps;
}

interface IDurationFieldState {
    fractionalHours: string;
}

const numberRegex = /^$|^(\d+(\.)?(\d{1,2})?)$/;

export default class DurationField extends React.PureComponent<IDurationFieldProps, IDurationFieldState> {
    constructor(props: IDurationFieldProps) {
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
            <FormControl value={this.state.fractionalHours} componentClass="input" type="text" onChange={this.onChange} onBlur={this.onBlur} />
        );
    }
}