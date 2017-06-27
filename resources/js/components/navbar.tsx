import * as React from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';

const NavMenu = () => {
    return (
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">Evolution Users</a>
                </Navbar.Brand>
            </Navbar.Header>

            <Nav pullRight>
                <NavItem eventKey={1} href="#">Users</NavItem>
                <NavItem eventKey={2} href="#">Organisation</NavItem>
                <NavItem eventKey={3} href="#">My Profile</NavItem>
                <NavItem eventKey={4} href="#">Logout</NavItem>
            </Nav>
        </Navbar>
    );
};

export default NavMenu;