import * as React from 'react';
import { Row, Col, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import Card from '../Card';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import { hasPermission } from '../utils/permissions';
interface IUserLayoutProps {
    params: {
        userId: number;
    };
}

export default class UserLayout extends React.PureComponent<IUserLayoutProps> {
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


@(connect((state: EL.State) => ({user: state.user})) as any)
class UserNavigation extends React.Component<IUserNavigationProps & {user?: EL.User}> {
    render() {
        const userId = this.props.userId;

        return (
            <Card title="User">
                <ListGroup >
                    <IndexLinkContainer to={`/my-profile/organisation/users/${userId}`}>
                        <ListGroupItem>Basic Details</ListGroupItem>
                    </IndexLinkContainer>

                    <LinkContainer to={`/my-profile/organisation/users/${userId}/emergency-contact`}>
                        <ListGroupItem>Emergency Contact</ListGroupItem>
                    </LinkContainer>

                    <LinkContainer to={`/my-profile/organisation/users/${userId}/addresses`}>
                        <ListGroupItem>Addresses</ListGroupItem>
                    </LinkContainer>

                    { hasPermission(this.props.user, 'administer organisation roles') && <LinkContainer to={`/my-profile/organisation/users/${userId}/roles`}>
                        <ListGroupItem>Roles</ListGroupItem>
                    </LinkContainer> }

                </ListGroup>
            </Card>
        );
    }
}