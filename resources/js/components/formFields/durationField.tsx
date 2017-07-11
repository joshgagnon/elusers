import * as React from 'react';
import { Col, Row, FormControl, HelpBlock } from 'react-bootstrap';
import { Field, WrappedFieldInputProps } from 'redux-form';
import * as leftPad from 'left-pad';
import { minutesToHoursAndMinutes } from '../utils';

const HOUR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const MINUTE_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];


interface IDurationFieldProps {
    input: WrappedFieldInputProps;
}

interface IDurationFieldState {
    minutes: number;
}

export default class DurationField extends React.PureComponent<IDurationFieldProps, IDurationFieldState> {
    constructor(props: IDurationFieldProps) {
        super(props);

        this.state = { minutes: 90 };

        this.onHourEvent = this.onHourEvent.bind(this);
        this.onMinuteEvent = this.onMinuteEvent.bind(this);
    }

    calcNewValue(override: { hours?: number; minutes?: number; }) {
        const currentValues = minutesToHoursAndMinutes(this.props.input.value || 0);
        const { minutes=0, hours=0 } = { ...currentValues, ...override };

        const newValue = parseInt(minutes + '') + (parseInt(hours + '') * 60);
        return newValue;
    }

    onHourEvent(e: React.ChangeEvent<any>, handler: Function) {
        const newValue = this.calcNewValue({ hours: e.target.value });
        handler(newValue);
    }

    onMinuteEvent(e: React.ChangeEvent<any>, handler: Function) {
        const newValue = this.calcNewValue({ minutes: e.target.value });
        handler(newValue);
    }


    render() {
        const { input: { value, onChange, onBlur } } = this.props;
        let { hours, minutes } = minutesToHoursAndMinutes(value || 0);

        return (
            <Row>
                <Col xs={6}>
                    <FormControl value={hours} componentClass="select" onChange={e => this.onHourEvent(e, onChange)} onBlur={e => this.onHourEvent(e, onBlur)} >
                        { HOUR_OPTIONS.map((optionValue, index) => {
                                const text = optionValue + ' hours';
                                return <option key={optionValue} value={optionValue}>{text}</option>;
                            })
                        }
                    </FormControl>
                </Col>

                <Col xs={6}>
                    <FormControl value={minutes} componentClass="select" onChange={e => this.onMinuteEvent(e, onChange)} onBlur={e => this.onMinuteEvent(e, onBlur)} >
                        { MINUTE_OPTIONS.map((optionValue, index) => {
                                const text = leftPad(optionValue, 2, 0) + ' min';
                                return <option key={optionValue} value={optionValue}>{text}</option>;
                            })
                        }
                    </FormControl>
                </Col>
            </Row>
        );
    }
}