import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { UserAddressesHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import Icon from '../icon';
import { Link } from 'react-router';
import { formatAddress } from '../utils';

interface AddressesProps {
    addresses: EL.Resource<EL.IAddress[]>;
}

@(connect((state: EL.State) => ({ user: state.user })) as any)
@UserAddressesHOC()
@PanelHOC<AddressesProps>('Addresses', props => props.addresses)
export default class Addresses extends React.PureComponent<AddressesProps> {
    render() {
        return (
            <div>
                <Link to="/my-profile/addresses/create" className="btn btn-success btn-icon-only"><Icon iconName="plus" />Add Address</Link>
                <hr />

                {this.props.addresses.data.map(address => <Address key={address.id} address={address} />)}
            </div>
        );
    }
}

interface IAddressProps {
    address: EL.IAddress;
}

class Address extends React.PureComponent<IAddressProps> {
    render() {
        const { address } = this.props;

        return (
            <div>
                <h3>{address.addressName} <Link className="btn-icon-only" to={`/my-profile/addresses/${address.id}/edit`}><Icon iconName="pencil-square-o" /></Link></h3>

                <p>{formatAddress(address)}</p>

                <hr />
            </div>
        );
    }
}