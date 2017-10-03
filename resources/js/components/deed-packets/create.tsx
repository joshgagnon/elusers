import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { validate } from '../utils/validation';
import { createResource, createNotification } from '../../actions';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Combobox, DatePicker, InputField } from '../form-fields';
import { ClientsHOC } from '../hoc/resourceHOCs';

interface ICreateDeedPacketProps {
    submit: (data: React.FormEvent<Form>) => void;
    clients: EL.Resource<EL.Client[]>;
}

interface IDeedPacketFormProps {
    handleSubmit: (data: React.FormEvent<Form>) => void;
    clientTitles: string[];
    saveButtonText: string;
}

@connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>) => {
            const url = 'deed-packets';
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Deed packet created.'), (response) => push('/deeds')],
                onFailure: [createNotification('Deed packet creation failed. Please try again.', true)],
            };

            return createResource(url, data, meta)
        }
    }
)
@ClientsHOC()
@PanelHOC('Create Deed Packet', [(props: ICreateDeedPacketProps) => props.clients])
export default class CreateDeedPacket extends React.PureComponent<ICreateDeedPacketProps> {
    render() {
        const clientTitles = this.props.clients.data.map(client => client.title)
        return <CreateDeedPacketForm onSubmit={this.props.submit} clientTitles={clientTitles} saveButtonText="Create Deed Packet" />;
    }
}

export const deedPacketValidationRules: EL.IValidationFields = {
    clientTitle: { name: 'Client title', required: true },
    documentDate: { name: 'Document date', required: true, isDate: true },
    parties: { name: 'Parties', required: true },
    matter: { name: 'Matter', required: true },
};

export class DeedPacketForm extends React.PureComponent<IDeedPacketFormProps> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <Combobox name="clientTitle" label="Client Title" data={this.props.clientTitles} />
                <DatePicker name="documentDate" label="Document Date" />
                <InputField name="parties" label="Parties" type="text" />
                <InputField name="matter" label="Matter" type="text" />

                <hr />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">{this.props.saveButtonText}</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}

const CreateDeedPacketForm = (reduxForm({
    form: 'create-deed-packet-form',
    validate: values => validate(deedPacketValidationRules, values)
})(DeedPacketForm) as any);