import * as React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import { hasPermission } from './utils/permissions';


export class NavMenu extends React.PureComponent<{routing: any, user: EL.User}> {
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

                        { hasPermission(this.props.user, 'view matters') && <LinkContainer to="/matters">
                            <NavItem>Matters</NavItem>
                        </LinkContainer> }

                        <LinkContainer to="/documents">
                            <NavItem>Documents</NavItem>
                        </LinkContainer>

                         { hasPermission(this.props.user, 'view contacts') && <LinkContainer to="/contacts">
                            <NavItem>Contacts</NavItem>
                        </LinkContainer> }

                         { hasPermission(this.props.user, 'view deeds') &&  <LinkContainer to="/deeds">
                            <NavItem>Deeds</NavItem>
                        </LinkContainer> }

                        <LinkContainer to="/cpdpr">
                            <NavItem>CPDPR</NavItem>
                        </LinkContainer>

                        <LinkContainer to="/wiki">
                            <NavItem>Knowledge Base</NavItem>
                        </LinkContainer>

                        { hasPermission(this.props.user, 'create template') &&  <LinkContainer to="/templates">
                            <NavItem>Templates</NavItem>
                        </LinkContainer> }


                        <LinkContainer to="/my-profile">
                            <NavItem>Account & Settings</NavItem>
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


export class NavMenuCheck extends React.PureComponent<{user: EL.User, routing: any}> {
    render() {
        if(this.props.user){
            return <NavMenu routing={this.props.routing} user={this.props.user}/>;
        }
        return <NavMenuPublic />
    }

}

export default connect<{user: EL.User, routing: any}, {}, {}>((state: EL.State) => {
    return {user: state.user, routing: state.routing};
})(NavMenuCheck);