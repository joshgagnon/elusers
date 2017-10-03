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

<<<<<<< HEAD:resources/js/components/deed-files/create.tsx
interface IDeedFileFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
=======
interface IDeedPacketFormProps {
    handleSubmit: (data: React.FormEvent<Form>) => void;
>>>>>>> 5c872a9d481025894e153f548d12eb2d0f695de0:resources/js/components/deed-packets/create.tsx
    clientTitles: string[];
    saveButtonText: string;
}

<<<<<<< HEAD:resources/js/components/deed-files/create.tsx
=======
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
>>>>>>> 5c872a9d481025894e153f548d12eb2d0f695de0:resources/js/components/deed-packets/create.tsx

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

<<<<<<< HEAD:resources/js/components/deed-files/create.tsx
const CreateDeedFileForm = (reduxForm({
    form: 'create-deed-file-form',
    validate: values => validate(deedFileValidationRules, values)
})(DeedFileForm) as any);




@(connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>) => {
            const url = 'deed-files';
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Deed file created.'), (response) => push('/deed-files')],
                onFailure: [createNotification('Deed file creation failed. Please try again.', true)],
            };

            return createResource(url, data, meta)
        }
    }
) as any)
@ClientsHOC()
@PanelHOC('Create Deed File', [(props: ICreateDeedFileProps) => props.clients])
export default class CreateDeedFile extends React.PureComponent<ICreateDeedFileProps> {
    render() {
        const clientTitles = this.props.clients.data.map(client => client.title)
        return <CreateDeedFileForm onSubmit={this.props.submit} clientTitles={clientTitles} saveButtonText="Create Deed File" />;
    }
}
=======
const CreateDeedPacketForm = (reduxForm({
    form: 'create-deed-packet-form',
    validate: values => validate(deedPacketValidationRules, values)
})(DeedPacketForm) as any);
>>>>>>> 5c872a9d481025894e153f548d12eb2d0f695de0:resources/js/components/deed-packets/create.tsx
