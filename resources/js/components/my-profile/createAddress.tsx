import * as React from 'react';
import { reduxForm } from 'redux-form';
import { validate } from '../utils/validation';
import { Form } from 'react-bootstrap';
import PanelHOC from '../hoc/panelHOC';
import { UserAddressHOC } from '../hoc/resourceHOCs';
import AddressForm from '../address/form';
import { createResource, createNotification } from '../../actions';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

interface ICreateAddressProps {
    user: EL.User;
}


@PanelHOC('Add Address')
class CreateAddress extends React.PureComponent<ICreateAddressProps, EL.Stateless> {
    render() {
        return <AddressForm onSubmit={(data: React.FormEvent<Form>) => this.props.submit(data, this.props.user.id)} />;
    }
}


export default  connect(
    (state: EL.State) => ({ user: state.user }),
    {
        submit: (data: React.FormEvent<Form>, userId: number) => {
            const url = `users/${userId}/addresses`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Address created.'), push('/my-profile/addresses')],
                onFailure: [createNotification('Address creation failed. Please try again.', true)]
            };

            return createResource(url, data, meta);
        }
    }
)(CreateAddress);