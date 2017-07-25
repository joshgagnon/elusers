import * as React from 'react';
import { Row, Col, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import Panel from '../panel';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

interface IUserLayoutProps {
    params: {
        userId: number;
    };
}

export default class UserLayout extends React.PureComponent<IUserLayoutProps, EL.Propless> {
    render() {
        return (
            <Row>
                <Col md={3}>
                    <UserNavigation userId={this.props.params.userId} />
                </Col>

                <Col md={9}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }
}

interface IUserNavigationProps {
    userId: number;
}

@connect((state: EL.State) => ({ authedUser: state.user }))
class UserNavigation extends React.Component<IUserNavigationProps, EL.Stateless> {
    render() {
        const userId = this.props.userId;

        return (
            <Panel title="User">
                <ListGroup fill>
                    <IndexLinkContainer to={`/users/${userId}`}>
                        <ListGroupItem>Basic Details</ListGroupItem>
                    </IndexLinkContainer>
                    
                    <LinkContainer to={`/users/${userId}/emergency-contact`}>
                        <ListGroupItem>Emergency Contact</ListGroupItem>
                    </LinkContainer>

                    <LinkContainer to={`/users/${userId}/addresses`}>
                        <ListGroupItem>Addresses</ListGroupItem>
                    </LinkContainer>

                    { this.props.authedUser.id === 2 || this.props.authedUser.id === 3 && 
                        <LinkContainer to={`/users/${userId}/password`}>
                            <ListGroupItem>Change Password</ListGroupItem>
                        </LinkContainer>
                    }
                </ListGroup>
            </Panel>
        );
    }
}