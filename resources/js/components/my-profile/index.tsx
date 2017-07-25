import * as React from 'react';
import { Row, Col, Form, Button, ButtonToolbar, ListGroup, ListGroupItem } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { Combobox, DatePicker, InputField } from '../form-fields';
import { connect } from 'react-redux';
import { fullname } from '../utils';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import Panel from '../panel';

export default class MyProfile extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return (
            <Row>
                <Col md={3}>
                    <MyProfileNavigation />
                    <MyOrganisationNavigation />

                    <Button block bsStyle="success">Create User</Button>
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
            <Panel title="Profile">
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

class MyOrganisationNavigation extends React.Component<EL.Propless, EL.Stateless> {
    render() {
        return (
            <Panel title="Organisation">
                <ListGroup fill>
                    <IndexLinkContainer to="/my-profile/organisation">
                        <ListGroupItem>Basic Details</ListGroupItem>
                    </IndexLinkContainer>
                </ListGroup>
            </Panel>
        );
    }
}