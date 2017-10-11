import * as React from 'react';
import { reduxForm } from 'redux-form';
import { validate } from '../utils/validation';
import { Form } from 'react-bootstrap';
import PanelHOC from '../hoc/panelHOC';
import { UserAddressHOC } from '../hoc/resourceHOCs';
import AddressForm from '../address/form';
import { updateResource, createNotification } from '../../actions';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

interface IEditAddressRouteMapperProps {
    params: {
        addressId:number;
    };
}

interface IEditAddressProps {
    addressId: number;
    address?: EL.Resource<EL.IAddress>;
    submit?: (data: any, addressId: number) => void
}

export default class EditAddressRouteMapper extends React.PureComponent<IEditAddressRouteMapperProps, EL.Stateless> {
    render() {
        return <EditAddress addressId={this.props.params.addressId} />;
    }
}

function mapStateToProps(state: EL.State) {
    return {
        user: state.user
    };
}

const mapDispatchToProps = {
    submit: (data: React.FormEvent<Form>, addressId: number) => {
        const url = `addresses/${addressId}`;
        const meta: EL.Actions.Meta = {
            onSuccess: [createNotification('Address updated.'), push('/my-profile/addresses')],
            onFailure: [createNotification('Address update failed. Please try again.', true)]
        };

        return updateResource(url, data, meta);
    }
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
@UserAddressHOC()
@PanelHOC<IEditAddressProps>('Edit Address', props => props.address)
class EditAddress extends React.PureComponent<IEditAddressProps, EL.Stateless> {
    render() {
        return <AddressForm
                    onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.addressId)}
                    initialValues={this.props.address.data} />;
    }
}
