import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { UserAddressesHOC, UserHOC, UserAddressHOC } from '../hoc/resourceHOCs';
import mapParamsToProps from '../hoc/mapParamsToProps';
import { connect } from 'react-redux';
import Icon from '../icon';
import { Link } from 'react-router';
import { formatAddress } from '../utils';
import AddressForm from '../address/form';
import { createNotification, updateResource, createResource } from '../../actions';
import { push } from 'react-router-redux';

interface IViewAddressesProps {
    addresses: EL.Resource<EL.IAddress[]>;
    userId: number;
}

interface IAddressProps {
    address: EL.IAddress;
    userId: number;
}

interface IEditAddressProps {
    addressId: EL.IAddress;
    userId: number;
}

interface ICreateAddressProps {
    user: EL.User;
}

@mapParamsToProps(['userId'])
@UserAddressesHOC()
@PanelHOC('Addresses', [props => props.addresses])
export class ViewAddresses extends React.PureComponent<IViewAddressesProps> {
    render() {
        return (
            <div>
                <Link to={`/users/${this.props.userId}/addresses/create`} className="btn btn-success"><Icon iconName="plus" />&nbsp;&nbsp;Add Address</Link>
                <hr />
                
                {this.props.addresses.data.map(address => <Address key={address.id} address={address} userId={this.props.userId} />)}
            </div>
        );
    }
}

class Address extends React.PureComponent<IAddressProps, EL.Stateless> {
    render() {
        const { address } = this.props;
        
        return (
            <div>
                <Link to={`/users/${this.props.userId}/addresses/${address.id}/edit`} className="btn btn-sm btn-info pull-right"><Icon iconName="pencil-square-o" />&nbsp;&nbsp;Edit</Link>
                <h3>{address.addressName}</h3>

                <p>{formatAddress(address)}</p>

                <hr />
            </div>
        );
    }
}

@mapParamsToProps(['userId', 'addressId'])
@connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>, addressId: number, userId: number) => {
            const url = `addresses/${addressId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Address updated.'), push(`/users/${userId}/addresses`)],
                onFailure: [createNotification('Address update failed. Please try again.', true)]
            };

            return updateResource(url, data, meta);
        }
    }
)
@UserHOC()
@UserAddressHOC()
@PanelHOC('Edit Address', [props => props.address])
export class EditAddress extends React.PureComponent<IEditAddressProps, EL.Stateless> {
    render() {
        return <AddressForm
                    onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.addressId, this.props.userId)}
                    initialValues={this.props.address.data} />;
    }
}

@mapParamsToProps(['userId'])
@connect(
    (state: EL.State) => ({ user: state.user }),
    {
        submit: (data: React.FormEvent<Form>, userId: number) => {
            const url = `users/${userId}/addresses`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Address created.'), push(`/users/${userId}/addresses`)],
                onFailure: [createNotification('Address creation failed. Please try again.', true)]
            };

            return createResource(url, data, meta);
        }
    }
)
@PanelHOC('Add Address')
export class CreateAddress extends React.PureComponent<ICreateAddressProps, EL.Stateless> {
    render() {
        return <AddressForm onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.userId)} />;
    }
}
