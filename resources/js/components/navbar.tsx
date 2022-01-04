import * as React from 'react';
import {Container, Nav, Navbar, NavItem} from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import { hasPermission } from './utils/permissions';


export class NavMenu extends React.PureComponent<{routing: any, user: EL.User}> {
    render() {
        return (
            <Navbar collapseOnSelect  expand="lg" bg="dark" variant="dark">
                <Container>
                    <LinkContainer to="/">
                <Navbar.Brand >

                    <img className="brand-logo" src="/images/cropped-evologo-768x92.png" alt="Home" />


                </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle  aria-controls="basic-navbar-nav" />
                <Navbar.Collapse role={'navigation'}  id="basic-navbar-nav">
                    <Nav className="me-auto">

                        { hasPermission(this.props.user, 'view matters') && <LinkContainer to="/matters">
                            <Nav.Link>Matters</Nav.Link>
                        </LinkContainer> }

                        <LinkContainer to="/documents">
                            <Nav.Link>Documents</Nav.Link>
                        </LinkContainer>

                         { hasPermission(this.props.user, 'view contacts') && <LinkContainer to="/contacts">
                            <Nav.Link>Contacts</Nav.Link>
                        </LinkContainer> }

                        { hasPermission(this.props.user, 'view deadlines') && <LinkContainer to="/deadlines">
                            <Nav.Link>Deadlines</Nav.Link>
                        </LinkContainer> }


                         { hasPermission(this.props.user, 'view deeds') &&  <LinkContainer to="/deeds">
                            <Nav.Link>Deeds</Nav.Link>
                        </LinkContainer> }

                        <LinkContainer to="/cpdpr">
                            <Nav.Link>CPDPR</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/wiki">
                            <Nav.Link>Knowledge Base</Nav.Link>
                        </LinkContainer>

                        { hasPermission(this.props.user, 'create template') &&  <LinkContainer to="/templates">
                            <Nav.Link>Templates</Nav.Link>
                        </LinkContainer> }

                        <LinkContainer to="/my-profile">
                            <Nav.Link>Account</Nav.Link>
                        </LinkContainer>

                        <LogoutButton />
                    </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export class NavMenuPublic extends React.PureComponent {
    render() {
        return (
            <Navbar  className="public-navbar">
                <Container>
                    <Navbar.Brand>
                        Evolution Lawyers
                    </Navbar.Brand>
                </Container>
            </Navbar>
        );
    }
}

class LogoutButton extends React.PureComponent {
    render() {
        return (<a href="/logout" className={"nav-link"}>Logout</a>
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