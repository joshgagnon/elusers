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

interface ICreateDeedFileProps {
    submit: (data: React.FormEvent<Form>) => void;
    clients: EL.Resource<EL.Client[]>;
}

interface IDeedFileFormProps {
    handleSubmit: (data: React.FormEvent<Form>) => void;
    clientTitles: string[];
    saveButtonText: string;
}

@connect(
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
)
@ClientsHOC()
@PanelHOC('Create Deed File', [(props: ICreateDeedFileProps) => props.clients])
export default class CreateDeedFile extends React.PureComponent<ICreateDeedFileProps> {
    render() {
        const clientTitles = this.props.clients.data.map(client => client.title)
        return <CreateDeedFileForm onSubmit={this.props.submit} clientTitles={clientTitles} saveButtonText="Create Deed File" />;
    }
}

export const deedFileValidationRules: EL.IValidationFields = {
    clientTitle: { name: 'Client title', required: true },
    documentDate: { name: 'Document date', required: true, isDate: true },
    parties: { name: 'Parties', required: true },
    matter: { name: 'Matter', required: true },
};

export class DeedFileForm extends React.PureComponent<IDeedFileFormProps> {
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

const CreateDeedFileForm = reduxForm({
    form: 'create-deed-file-form',
    validate: values => validate(deedFileValidationRules, values)
})(DeedFileForm);