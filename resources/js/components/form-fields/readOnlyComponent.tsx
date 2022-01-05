import * as React from 'react';
import {FormGroup, FormLabel,  Col, FormControl, Form} from 'react-bootstrap';


interface IInputFieldComponentProps {
    value: string;
    label: string;
    help?: string;
}

export default class InputFieldComponent extends React.PureComponent<IInputFieldComponentProps> {
    render() {
        return <FormGroup>
                <Col as={FormLabel} md={3}>
                    {this.props.label}
                </Col>
                <Col md={8}>
                    <FormControl value={this.props.value} as="input" type="text" readOnly/>
                    <Form.Text>{this.props.help}</Form.Text>
                </Col>

            </FormGroup>
    }
}