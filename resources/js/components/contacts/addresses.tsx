import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { ContactAddressesHOC, ContactAddressHOC } from '../hoc/resourceHOCs';
import mapParamsToProps from '../hoc/mapParamsToProps';
import { connect } from 'react-redux';
import Icon from '../icon';
import { Link } from 'react-router';
import { formatAddress } from '../utils';
import AddressForm from '../address/form';
import { createNotification, updateResource, createResource } from '../../actions';
import { push } from 'react-router-redux';
import { Form, ButtonToolbar } from 'react-bootstrap';

interface IViewAddressesProps {
    addresses: EL.Resource<EL.IAddress[]>;
    contactId: number;
}

interface IAddressProps {
    address: EL.IAddress;
    contactId: number;
}

interface IEditAddressProps {
    addressId: number;
    contactId: number;
    submit: (args: any, addressId: number, contactId: number) => void,
    address?: any
}

interface ICreateAddressProps {
    contactId: number,
    submit: (args: any,  contactId: number) => void,
}

@mapParamsToProps(['contactId'])
@ContactAddressesHOC()
@PanelHOC<IViewAddressesProps>('Addresses', props => props.addresses)
export class ViewAddresses extends React.PureComponent<IViewAddressesProps> {
    render() {
        const { contactId } = this.props;
        return (
            <div>
                <Link to={`/contacts/${this.props.contactId}/addresses/create`} className="btn btn-success"><Icon iconName="plus" />Add Address</Link>
                <hr />

                {this.props.addresses.data.map(address => <Address key={address.id} address={address} contactId={this.props.contactId} />)}
                <ButtonToolbar>
                    <Link to={`/contacts/${contactId}`} className="pull-right btn btn-default" type="submit">Back</Link>
                </ButtonToolbar>
            </div>
        );
    }
}

class Address extends React.PureComponent<IAddressProps> {
    render() {
        const { address } = this.props;

        return (
            <div>
                <Link to={`/contacts/${this.props.contactId}/addresses/${address.id}/edit`} className="btn btn-sm btn-info pull-right"><Icon iconName="pencil-square-o" />Edit</Link>
                <h3>{address.addressName}</h3>

                <p>{formatAddress(address)}</p>

                <hr />
            </div>
        );
    }
}

@mapParamsToProps(['contactId', 'addressId'])
@(connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>, addressId: number, contactId: number) => {
            const url = `contacts/${contactId}/addresses/${addressId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Address updated.'), push(`/contacts/${contactId}/addresses`)],
                onFailure: [createNotification('Address update failed. Please try again.', true)]
            };

            return updateResource(url, data, meta);
        }
    }
) as any)


@ContactAddressHOC()
@PanelHOC<IEditAddressProps>('Edit Address', props => props.address)
export class EditAddress extends React.PureComponent<IEditAddressProps> {
    render() {
        const { contactId } = this.props;
        return <div>
                <AddressForm
                    onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.addressId, this.props.contactId)}
                    initialValues={this.props.address.data} />
                <ButtonToolbar>
                    <Link to={`/contacts/${contactId}/addresses`} className="pull-right btn btn-default" type="submit">Back</Link>
                </ButtonToolbar>
            </div>
    }
}

@mapParamsToProps(['contactId'])
@(connect(
    (state: EL.State) => ({ }),
    {
        submit: (data: React.FormEvent<Form>, contactId: number) => {
            const url = `contacts/${contactId}/addresses`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Address created.'), push(`/contacts/${contactId}/addresses`)],
                onFailure: [createNotification('Address creation failed. Please try again.', true)]
            };

            return createResource(url, data, meta);
        }
    }
) as any)
@PanelHOC<ICreateAddressProps>('Add Address')
export class CreateAddress extends React.PureComponent<ICreateAddressProps> {
    render() {
        return <AddressForm onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.contactId)} />;
    }
}