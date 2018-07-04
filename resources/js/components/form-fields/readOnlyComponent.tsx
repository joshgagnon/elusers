import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { FormGroup, ControlLabel, HelpBlock, Col, FormControl, Button, Row } from 'react-bootstrap';


interface IInputFieldComponentProps {
    value: string;
    label: string;
    help?: string;
}

export default class InputFieldComponent extends React.PureComponent<IInputFieldComponentProps> {
    render() {
        return <Row>
            <FormGroup>
                <Col componentClass={ControlLabel} md={3}>
                    {this.props.label}
                </Col>
                <Col md={8}>
                    <FormControl value={this.props.value} componentClass="input" type="text" readOnly/>
                    <HelpBlock>{this.props.help}</HelpBlock>
                </Col>

            </FormGroup>
            </Row>
    }
}