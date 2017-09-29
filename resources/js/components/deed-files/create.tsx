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

interface ICreateDeedFileFormProps {
    handleSubmit: (data: React.FormEvent<Form>) => void;
    clientTitles: string[];
}

@connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>) => console.log(data)
    }
)
@ClientsHOC()
@PanelHOC('Create Deed File', [(props: ICreateDeedFileProps) => props.clients])
export default class CreateDeedFile extends React.PureComponent<ICreateDeedFileProps> {
    render() {
        const clientTitles = this.props.clients.data.map(client => client.title)
        return <CreateDeedFileForm onSubmit={this.props.submit} clientTitles={clientTitles} />;
    }
}

const createDeedFileValidationRules: EL.IValidationFields = {
    clientName: { name: 'Client name', required: true },
    documentDate: { name: 'Document date', required: true, isDate: true },
    parties: { name: 'Parties', required: true },
    matter: { name: 'Matter', required: true },
};

@reduxForm({ form: 'create-deed-file-form', validate: values => validate(createDeedFileValidationRules, values) })
class CreateDeedFileForm extends React.PureComponent<ICreateDeedFileFormProps> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <Combobox name="clientName" label="Client Name" data={this.props.clientTitles} />
                <DatePicker name="documentDate" label="Document Date" />
                <InputField name="parties" label="Parties" type="text" />
                <InputField name="matter" label="Matter" type="text" />

                <hr />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Create Deed File</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}