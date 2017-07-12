import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

export default class NavMenu extends React.Component<{}, {}> {
    render() {
        return (
            <Navbar collapseOnSelect staticTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to={`/`}>Evolution Users</Link>
                    </Navbar.Brand>

                    <Navbar.Toggle />
                </Navbar.Header>

                <Navbar.Collapse>
                    <Nav pullRight>
                        <IndexLinkContainer to="/">
                            <NavItem eventKey={1}>Home</NavItem>
                        </IndexLinkContainer>
                        <LinkContainer to="/users">
                            <NavItem eventKey={1}>Users</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/organisation">
                            <NavItem eventKey={1}>Organisation</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/cpdpr">
                            <NavItem eventKey={1}>CPDPR</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/my-profile">
                            <NavItem eventKey={1}>My Profile</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/logout">
                            <NavItem eventKey={1}>Logout</NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}