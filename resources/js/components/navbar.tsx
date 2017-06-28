import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom'

const NavMenu = () => {
    return (
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">Evolution Users</a>
                </Navbar.Brand>
            </Navbar.Header>

            <Nav pullRight>
                <NavItem eventKey={1} href="#"><Link to={`/`}>Users</Link></NavItem>
                <NavItem eventKey={2} href="#"><Link to={`organisation`}>Organisation</Link></NavItem>
                <NavItem eventKey={3} href="#">My Profile</NavItem>
                <NavItem eventKey={4} href="#">Logout</NavItem>
            </Nav>
        </Navbar>
    );
};

export default NavMenu;