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
    naked?: boolean;
    help?: JSX.Element;
}

export class NakedBaseFieldComponent extends React.PureComponent<IBaseFieldComponentProps> {
    validationState(touched: boolean, error: string, warning: string) {
        if (!touched) {
            return null;
        }
        if(error) {
            return 'error'
        }
        if(warning) {
            return 'warning';
        }
        return 'success';
    }

    render() {
        const { label, meta: { touched, error, warning } } = this.props;
        const displayError = touched && warning
        const displayWarning = touched && warning;
        return (
            <FormGroup validationState={this.validationState(touched, error, warning)} className={ 'naked '  + (this.props.required ? 'required' : '')}>
                    {this.props.children}
                    { displayError && <HelpBlock>{error}</HelpBlock>}
                    { displayWarning && <HelpBlock>{warning}</HelpBlock> }
                    <HelpBlock>{this.props.help}</HelpBlock>
            </FormGroup>
     );
    }
}


export default class BaseFieldComponent extends React.PureComponent<IBaseFieldComponentProps> {
    validationState(touched: boolean, error: string, warning: string) {
        if (!touched) {
            return null;
        }
        if(error) {
            return 'error'
        }
        if(warning) {
            return 'warning';
        }
        return 'success';
    }

    render() {
        const { label, meta: { touched, error, warning }, naked } = this.props;
        const displayError = touched && error;
        const displayWarning = touched && warning;
        if(naked){
            return <NakedBaseFieldComponent {...this.props} />
        }
        return (
            <FormGroup validationState={this.validationState(touched, error, warning)} className={this.props.required ? 'required' : null}>
                <Col componentClass={ControlLabel} md={3}>
                    {label}
                </Col>
                <Col md={8}>
                    {this.props.children}
                    { displayError && <HelpBlock>{error}</HelpBlock>}
                    { displayWarning && <HelpBlock>{warning}</HelpBlock>}
                    <HelpBlock>{this.props.help}</HelpBlock>
                </Col>
                {!!this.props.showRemoveButton &&
                    <Col md={1}>
                        <Button className="btn-icon-only" onClick={this.props.onRemoveButtonClick}><Icon iconName="trash-o" /></Button>
                    </Col>
                }
            </FormGroup>
     );
    }
}

