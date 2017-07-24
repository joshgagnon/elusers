import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { UserAddressesHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import Icon from '../icon';
import { Link } from 'react-router';

interface IAddressesProps {
    addresses: EL.Resource<EL.IAddress[]>;
}

@connect((state: EL.State) => ({ user: state.user }))
@UserAddressesHOC()
@PanelHOC('Addresses', [props => props.addresses])
export default class Addresses extends React.PureComponent<IAddressesProps, EL.Stateless> {
    render() {
        return (
            <div>
                <Link to="/my-profile/addresses/create" className="btn btn-success"><Icon iconName="plus" />&nbsp;&nbsp;Add Address</Link>
                <hr />
                <Row>{this.props.addresses.data.map(address => <Address key={address.id} address={address} />)}</Row>
            </div>
        );
    }
}

interface IAddressProps {
    address: EL.IAddress;
}

class Address extends React.PureComponent<IAddressProps, EL.Stateless> {
    render() {
        const { address } = this.props;
        return (
            <Col md={6}>
                <h3>{address.addressName} <Link to={`/my-profile/addresses/${address.id}/edit`}><Icon iconName="pencil-square-o" /></Link></h3>
                <p>
                    {address.addressOne},<br />
                    {address.addressTwo},<br />
                    {address.addressThree},<br />
                    {address.postCode},<br />
                    {address.countryCode}
                </p>
            </Col>
        );
    }
}