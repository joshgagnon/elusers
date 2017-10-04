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

interface CreateDeedPacketProps {
    submit: (data: React.FormEvent<Form>) => void;
}

interface DeedPacketFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    clientTitles: string[];
    saveButtonText: string;
}

export const deedPacketValidationRules: EL.IValidationFields = {
    title: { name: 'title', required: true },
};

export class DeedPacketForm extends React.PureComponent<DeedPacketFormProps> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <InputField name="title" label="Title" type="text" />

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

@(connect(
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
) as any)
@PanelHOC('Create Deed Packet')
export default class CreateDeedPacket extends React.PureComponent<CreateDeedPacketProps> {
    render() {
        return <CreateDeedPacketForm onSubmit={this.props.submit} saveButtonText="Create Deed Packet" />;
    }
}
