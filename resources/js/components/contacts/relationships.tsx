import * as React from 'react';
import { ContactsHOC, ContactHOC } from '../hoc/resourceHOCs';
import { reduxForm, formValueSelector, FieldArray } from 'redux-form';

import Icon from '../icon';
import { ContactSelector } from './contactSelector';
import { FormControl, ControlLabel, FormGroup, InputGroup, Glyphicon, Button, Col, Alert } from 'react-bootstrap';
import { DropdownListField  } from '../form-fields';




const RELATIONSHIP_TYPES = [
    "Accountant",
    "Attorney",
    "Authorised Person",
    "Beneficiary",
    "Beneficial Owner",
    "Child",
    "De Facto Partner",
    "Director",
    "Employee",
    "Employer",
    "Grandchild",
    "Grandparent",
    "Guardian",
    "Lawyer",
    "Parent",
    "Holding Company",
    "Parent Company",
    "Partner",
    "Sibling",
    "Shareholder",
    "Spouse",
    "Subsidiary",
    "Trustee",
    "Trustee of"
];


const RELATIONSHIP_OPTIONS = RELATIONSHIP_TYPES.map((type) => ({value: type}));

export class RelationshipTypeSelector extends React.PureComponent<{name?: string;required?: boolean; naked?: boolean}> {
    render() {
        return <DropdownListField name={this.props.name}  naked={this.props.naked} textField="value" valueField="value"
            placeholder="None" data={RELATIONSHIP_OPTIONS} required={this.props.required}/>
    }
}


class RelationshipSelector extends React.PureComponent<any> {
    render() {
        const { fields } = this.props;
        console.log(this.props)
        return <div>
            { fields.map((contact, index) => (
              <div key={index}>

                <FormGroup>
                    <Col componentClass={ControlLabel} md={3}>
                        Relationship
                    </Col>
                    <Col md={4}>
                         <ContactSelector name={`${contact}.secondContactId`} required naked={true}/>
                    </Col>
                    <Col md={4}>
                         <RelationshipTypeSelector name={`${contact}.relationshipType`} required naked={true}/>
                    </Col>
                    <Col md={1}>
                        <Button className="btn-icon-only" onClick={(e) => {
                                e.preventDefault();
                                fields.remove(index)
                              }}><Icon iconName="trash-o" /></Button>
                    </Col>
                    </FormGroup>
              </div>
            )) }
              <div className="button-row">
                  <Button onClick={() => fields.push({})}>
                Add Relationship
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


export class Relationships extends React.PureComponent<{}> {
    render() {
         return <React.Fragment>
                <FieldArray name="relationships" component={RelationshipSelector as any} />
         </React.Fragment>
    }
}