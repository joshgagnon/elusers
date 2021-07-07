import * as React from 'react';
import { Row, Col, Form, Button, ButtonToolbar, ListGroup, ListGroupItem } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { Combobox, DatePicker, InputField } from '../form-fields';
import { connect } from 'react-redux';
import { fullname } from '../utils';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import Panel from '../panel';
import { hasPermission } from '../utils/permissions';


@(connect((state: EL.State) => ({user: state.user})) as any)
export default class MyProfile extends React.PureComponent<{user: EL.User}> {
    render() {
        return (
            <Row>
                <Col md={3}>
                    <MyProfileNavigation />
                    { hasPermission(this.props.user, 'administer organisation') &&  <MyOrganisationNavigation user={this.props.user}/> }


                </Col>

                <Col md={9}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }
}

class MyProfileNavigation extends React.Component { // Cannot be pure component - or links wont update their ective state
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

                    <LinkContainer to="/my-profile/integrations">
                        <ListGroupItem>Integrations</ListGroupItem>
                    </LinkContainer>

                </ListGroup>
            </Panel>
        );
    }
}


class MyOrganisationNavigation extends React.Component<{user: EL.User}> {
    render() {
        return (
            <Panel title="Organisation">
                <ListGroup fill>
                    <IndexLinkContainer to="/my-profile/organisation">
                        <ListGroupItem>Basic Details</ListGroupItem>
                    </IndexLinkContainer>

                    { hasPermission(this.props.user, 'administer organisation users') && <IndexLinkContainer to="/my-profile/organisation/users">
                         <ListGroupItem>Users</ListGroupItem>
                    </IndexLinkContainer> }
                    {/* <IndexLinkContainer to="/my-profile/organisation/permissions">
                        { hasPermission(this.props.user, 'administer organisation permissions') && <ListGroupItem>Permissions</ListGroupItem> }
                    </IndexLinkContainer> */ }
                    { hasPermission(this.props.user, 'administer organisation roles') && <IndexLinkContainer to="/my-profile/organisation/roles">
                         <ListGroupItem>Roles</ListGroupItem>
                    </IndexLinkContainer> }
                </ListGroup>
            </Panel>
        );
    }
}