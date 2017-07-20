import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { Row, Col, Form, Button, ButtonToolbar, ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { Combobox, DatePicker, InputField } from '../form-fields';
import { connect } from 'react-redux';
import { fullname } from '../utils';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

import BasicDetailsForm from './basicDetailsForm';
import EmergencyContactForm from './EmergencyContactForm';

export default class MyProfile extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return (
            <Row>
                <Col md={3}>
                    <MyProfileNavigation />
                </Col>

                <Col md={9}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }
}

class MyProfileNavigation extends React.Component<EL.Propless, EL.Stateless> { // Cannot be pure component - or links wont update their ective state
    render() {
        return (
            <Panel>
                <ListGroup fill>
                    <IndexLinkContainer to="/my-profile">
                        <ListGroupItem>Basic Details</ListGroupItem>
                    </IndexLinkContainer>
                    
                    <LinkContainer to="/my-profile/emergency-contact">
                        <ListGroupItem>Emergency Contact</ListGroupItem>
                    </LinkContainer>

                    <LinkContainer to="/my-profile/addresses">
                        <ListGroupItem>Addresses</ListGroupItem>
                    </LinkContainer>

                    <LinkContainer to="/my-profile/password">
                        <ListGroupItem>Change Password</ListGroupItem>
                    </LinkContainer>
                </ListGroup>
            </Panel>
        );
    }
}

@connect((state: EL.State) => ({ user: state.user }))
@PanelHOC('Basic Details')
export class BasicDetails extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return (
            <BasicDetailsForm handleSubmit={(data: object) => console.log(data)} initialValues={this.props.user} />
        );
    }
}

@connect((state: EL.State) => ({ user: state.user }))
@PanelHOC('Emergency Contact')
export class EmergencyContact extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return (
            <EmergencyContactForm handleSubmit={(data: object) => console.log(data)} initialValues={this.props.user} />
        );
    }
}