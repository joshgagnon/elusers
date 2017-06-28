import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap';

const NavMenu = () => {
    return (
        <Navbar collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to={`/`}>Evolution Users</Link>
                </Navbar.Brand>

                <Navbar.Toggle />
            </Navbar.Header>

            <Navbar.Collapse>
                <Nav pullRight>
                    <LinkContainer exact to="/">
                        <NavItem eventKey={1}>Home</NavItem>
                    </LinkContainer>
                    <LinkContainer exact to="/users">
                        <NavItem eventKey={1}>Users</NavItem>
                    </LinkContainer>
                    <LinkContainer exact to="/organisation">
                        <NavItem eventKey={1}>Organisation</NavItem>
                    </LinkContainer>
                    <LinkContainer exact to="/">
                        <NavItem eventKey={1}>My Profile</NavItem>
                    </LinkContainer>
                    <LinkContainer exact to="/">
                        <NavItem eventKey={1}>Logout</NavItem>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavMenu;