import * as React from 'react';
import { validate } from '../utils/validation';
import { InputField, SelectField, Combobox, TextArea } from '../form-fields';
import { reduxForm, formValueSelector, FieldArray, FormSection } from 'redux-form';
import Icon from '../icon';
import { FormControl, ControlLabel, FormGroup, InputGroup, Glyphicon, Button, Col, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { AddressFields } from '../address/form';


export class EmailFields extends React.PureComponent<{}> {
    render(){
        return <React.Fragment>
            <FormGroup className="no-margin">
                <Col componentClass={ControlLabel} md={3}>
                     Email
                </Col>
                 <Col md={4}>
                    <Combobox name="subtype"  naked required  placeholder="Subtype" data={[
                    'Personal', 'Business'
                    ]}/>
                 </Col>
                <Col md={4}>
                <InputField name="email"  naked  type="text" required placeholder="Email Address"/>
                </Col>
              </FormGroup>
                   <InputField  name="notes" label="Notes" type="text"  placeholder="Notes.."/>
              </React.Fragment>
    }
}

export class FaxFields extends React.PureComponent<{}> {
    render(){
        return <React.Fragment>
            <FormGroup className="no-margin">
               <Col componentClass={ControlLabel} md={3}>
               Fax
               </Col>
                 <Col md={4}>
                    <Combobox name="subtype"  naked required  placeholder="Subtype" data={[
                    'Home', 'Business'
                    ]}/>
                 </Col>

                <Col md={4}>
                <InputField name="fax"  naked label="Fax" type="text" required placeholder="Fax"/>
                </Col>

              </FormGroup>
                   <InputField  name="notes" label="Notes" type="text"  placeholder="Notes.."/>
              </React.Fragment>
    }
}

export class PhoneFields extends React.PureComponent<{}> {
    render(){
        return <React.Fragment>
            <FormGroup className="no-margin">
                <Col componentClass={ControlLabel} md={3}>
                     Phone
                </Col>
                 <Col md={4}>
                <Combobox name="subtype"  naked required  placeholder="Subtype" data={[
                'Home', 'Business', 'Mobile'
                ]}/>
                 </Col>
                 <Col md={4}>
                <InputField name="phone" naked  type="text" required  placeholder="Phone Number"/>
                </Col>

              </FormGroup>
                   <InputField  name="notes" label="Notes" type="text" placeholder="Notes.."/>
              </React.Fragment>
    }
}

export class ContactInformationSwitch extends React.PureComponent<{name: string, type: string}> {

    render() {
        switch(this.props.type) {
            case 'email':
                return <EmailFields />
            case 'phone':
                return <PhoneFields />
            case 'fax':
                return <FaxFields />
            case 'address':
                return <React.Fragment>
                        <Combobox name="subtype" label="Address Type" required  placeholder="Subtype" data={[
                        'Billing', 'Postal', 'Residential', 'Registered Office'
                        ]}/>
                    <AddressFields />
                    </React.Fragment>
            return false;
        }
        return false;
    }
}

const ConnectedContactInformationSwitch = connect<{}, {}, {selector: (state: any, ...args) => any, name: string}>((state: EL.State, props: {selector: (state: any, ...args) => any, name: string}) => {
    return {type: props.selector(state, `${props.name}.type`)};
})(ContactInformationSwitch as any);


export class ContactInformationFields extends React.PureComponent<{selector: (state: any, ...args) => any, fields: any, meta: any }> {
    render() {
        const { fields } = this.props;
        return <div>
            { fields.map((contactInformation, index) => (
              <div key={index}>
                <FormGroup className="no-margin">
                    <Col componentClass={ControlLabel} md={3}>
                         Type
                    </Col>
                    <Col md={8}>
                        <SelectField name={`${contactInformation}.type`} prompt={true} naked={true} options={
                            [
                            {value: 'email', text: 'Email'},
                            {value: 'phone', text: 'Phone'},
                            {value: 'fax', text: 'Fax'},
                            {value: 'address', text: 'Address'}
                            ]
                        } />
                    </Col>

                    <Col md={1}>
                        <Button className="btn-icon-only" onClick={(e) => {
                                e.preventDefault();
                                fields.remove(index)
                              }}><Icon iconName="trash-o" /></Button>
                    </Col>
                    </FormGroup>
                    <FormSection name={`${contactInformation}.data`}>
                        <ConnectedContactInformationSwitch selector={this.props.selector} name={`${contactInformation}`} />
                      </FormSection>
                      { index !== fields.length -1  && <hr /> }
              </div>
            )) }
              <div className="button-row">
                  <Button onClick={() => fields.push({})}>
                Add Contact Information
                </Button>
            { this.props.meta.error && <Alert bsStyle="danger">
                <p className="text-center">
                { this.props.meta.error }
                </p>
            </Alert> }
              </div>
          </div>
    }
}
