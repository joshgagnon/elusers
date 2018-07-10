import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';


export class NavMenu extends React.PureComponent {
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

                        <LinkContainer to="/matters">
                            <NavItem>Matters</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/documents">
                            <NavItem>Documents</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/contacts">
                            <NavItem>Contacts</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/deeds">
                            <NavItem>Deeds</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/cpdpr">
                            <NavItem>CPDPR</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/wiki">
                            <NavItem>Knowledge Base</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/templates">
                            <NavItem>Templates</NavItem>
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

export class NavMenuPublic extends React.PureComponent {
    render() {
        return (
            <Navbar staticTop  className="public-navbar">
                <Navbar.Header>
                    <Navbar.Brand>
                        Evolution Lawyers
                    </Navbar.Brand>
                </Navbar.Header>
            </Navbar>
        );
    }
}

class LogoutButton extends React.PureComponent {
    render() {
        return (
            <li role="presentation">
                <a href="/logout">Logout</a>
            </li>
        );
    }
}

@(connect((state: EL.State) => {
    return {user: state.user};
}) as any)
export default class NavMenuCheck extends React.PureComponent<{user?: EL.User}> {
    render() {
        if(this.props.user){
            return <NavMenu />;
        }
        return <NavMenuPublic />
    }

}
