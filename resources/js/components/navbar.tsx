import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

export default class NavMenu extends React.Component<EL.Propless, EL.Stateless> {
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

                        <LinkContainer to="/users">
                            <NavItem>Users</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/organisation">
                            <NavItem>Organisation</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/cpdpr">
                            <NavItem>CPDPR</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/wiki">
                            <NavItem>Knowledge Base</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/my-profile">
                            <NavItem>My Profile</NavItem>
                        </LinkContainer>

                        <LogoutButton />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

class LogoutButton extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return (
            <li role="presentation">
                <a href="/logout">Logout</a>
            </li>
        );
    }
}