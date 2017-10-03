import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { updateResource, createNotification } from '../../actions';
import { Form } from 'react-bootstrap';
import { deedFileValidationRules, DeedFileForm } from './create';
import { validate } from '../utils/validation';
import { push } from 'react-router-redux';
import { ClientsHOC, DeedFileHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

interface EditDeedFileProps {
    submit?: (data: React.FormEvent<Form>) => void;
    clients: EL.Resource<EL.Client[]>;
    deedFileId: number;
    deedFile: EL.Resource<EL.DeedFile>;
}

@(connect(
    undefined,
    (dispatch: Function, ownProps: { deedFileId: number }) => ({
        submit: (data: React.FormEvent<Form>) => {
            const url = `deed-files/${ownProps.deedFileId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Deed file updated.'), (response) => push('/deed-files')],
                onFailure: [createNotification('Deed file update failed. Please try again.', true)],
            };

            return dispatch(updateResource(url, data, meta))
        }
    })
) as any)
@DeedFileHOC()
@ClientsHOC()
@PanelHOC('Edit Deed File', [(props: EditDeedFileProps) => props.deedFile, (props: EditDeedFileProps) => props.clients])
class EditDeedFile extends React.PureComponent<EditDeedFileProps> {
    render() {
        const clientTitles = this.props.clients.data.map(client => client.title)
        return <EditDeedFileForm onSubmit={this.props.submit} clientTitles={clientTitles} initialValues={this.props.deedFile.data} saveButtonText="Save Deed File" />;
    }
}

export default class EditDeedFileRouteMapper extends React.PureComponent<{params: {deedFileId: number}}> {
    render() {
        return <EditDeedFile deedFileId={this.props.params.deedFileId} />;
    }
}

const EditDeedFileForm = (reduxForm({
    form: 'edit-deed-file-form',
    validate: values => validate(deedFileValidationRules, values)
})(DeedFileForm) as any);
