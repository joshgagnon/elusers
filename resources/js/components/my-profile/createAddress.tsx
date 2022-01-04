import * as React from 'react';
import { reduxForm } from 'redux-form';
import { validate } from '../utils/validation';
import { Form } from 'react-bootstrap';
import CardHOC from '../hoc/CardHOC';
import { UserAddressHOC } from '../hoc/resourceHOCs';
import AddressForm from '../address/form';
import { createResource, createNotification } from '../../actions';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

interface ICreateAddressProps {
    user: EL.User;
    submit: (data: any, userId: number) => void
}


@CardHOC<ICreateAddressProps>('Add Address')
class CreateAddress extends React.PureComponent<ICreateAddressProps> {
    render() {
        return <AddressForm onSubmit={(data: React.FormEvent<typeof Form>) => this.props.submit(data, this.props.user.id)} />;
    }
}


export default  connect(
    (state: EL.State) => ({ user: state.user }),
    {
        submit: (data: React.FormEvent<typeof Form>, userId: number) => {
            const url = `users/${userId}/addresses`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Address created.'), push('/my-profile/addresses')],
                onFailure: [createNotification('Address creation failed. Please try again.', true)]
            };

            return createResource(url, data, meta);
        }
    }
)(CreateAddress as any);