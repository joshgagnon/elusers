import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { updateResource, createNotification } from '../../actions';
import { Form } from 'react-bootstrap';
import { deedPacketValidationRules, DeedPacketForm } from './create';
import { validate } from '../utils/validation';
import { push } from 'react-router-redux';
import { ClientsHOC, DeedPacketHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

interface EditDeedPacketProps {
    submit: (data: React.FormEvent<Form>) => void;
    clients: EL.Resource<EL.Client[]>;
    deedPacketId: number;
    deedPacket: EL.Resource<EL.DeedPacket>;
}

@connect(
    undefined,
    (dispatch: Function, ownProps: { deedPacketId: number }) => ({
        submit: (data: React.FormEvent<Form>) => {
            const url = `deed-packets/${ownProps.deedPacketId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Deed packet updated.'), (response) => push('/deeds')],
                onFailure: [createNotification('Deed packet update failed. Please try again.', true)],
            };

            return dispatch(updateResource(url, data, meta))
        }
    })
)
@DeedPacketHOC()
@ClientsHOC()
@PanelHOC('Edit Deed Packet', [(props: EditDeedPacketProps) => props.deedPacket, (props: EditDeedPacketProps) => props.clients])
class EditDeedPacket extends React.PureComponent<EditDeedPacketProps> {
    render() {
        const clientTitles = this.props.clients.data.map(client => client.title)
        return <EditDeedPacketForm onSubmit={this.props.submit} clientTitles={clientTitles} initialValues={this.props.deedPacket.data} saveButtonText="Save Deed Packet" />;
    }
}

export default class EditDeedPacketRouteMapper extends React.PureComponent<{params: {deedPacketId: number}}> {
    render() {
        return <EditDeedPacket deedPacketId={this.props.params.deedPacketId} />;
    }
}

const EditDeedPacketForm = reduxForm({
    form: 'edit-deed-packet-form',
    validate: values => validate(deedPacketValidationRules, values)
})(DeedPacketForm);
