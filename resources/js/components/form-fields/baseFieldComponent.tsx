import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { FormGroup, ControlLabel, HelpBlock, Col, FormControl, Button } from 'react-bootstrap';
import Icon from '../icon';

export interface IFieldComponentProps extends WrappedFieldProps {
    label: string;
    type: string;
    value?: string
}

export interface IBaseFieldComponentProps extends IFieldComponentProps {
    children: any;
    showRemoveButton?: boolean;
    onRemoveButtonClick?: () => void;
    required?: boolean;
}

export default class BaseFieldComponent extends React.PureComponent<IBaseFieldComponentProps> {
    validationState(touched: boolean, error: string) {
        if (!touched) {
            return null;
        }

        return error ? 'error' : 'success';
    }

    render() {
        const { label, meta: { touched, error } } = this.props;
        const displayError = touched && error;

        return (
            <FormGroup validationState={this.validationState(touched, error)} className={this.props.required ? 'required' : null}>
                <Col componentClass={ControlLabel} md={3}>
                    {label}
                </Col>
                <Col md={8}>
                    {this.props.children}
                    { displayError && <HelpBlock>{error}</HelpBlock>}
                </Col>
                {!!this.props.showRemoveButton &&
                    <Col md={1}>
                        <Button onClick={this.props.onRemoveButtonClick}><Icon iconName="trash-o" /></Button>
                    </Col>
                }
            </FormGroup>
        );
    }
}