import * as React from 'react';
import { ButtonToolbar, Form, FormControl, Button } from 'react-bootstrap';
import Table from '../dataTable';
import { Link } from 'react-router';
import Icon from '../icon';
import PanelHOC from '../hoc/panelHOC';
import { DeedPacketsHOC, DeedPacketHOC, UsersHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { createResource, deleteResource, createNotification, updateResource } from '../../actions';
import { name, formatDate } from '../utils';
import { Combobox, DatePicker, InputField } from '../form-fields';
import { validate } from '../utils/validation';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';

interface DeedPacketsProps {
    users: EL.Resource<EL.User[]>;
    deedPackets: EL.Resource<EL.DeedPacket[]>;
    deleteDeedPacket: (deedPacketId: number) => void;
}

const HEADINGS = ['ID', 'Document Name', 'Document Date', 'Matter ID', 'Created By', 'Actions'];

const data = [{
    id: 1,
    clientName: 'Jeff',
    documentDate: '2017-11-16',
    parties: 'parties',
    matter: 'matter',
    createdBy: 'testing',
}];


@connect(undefined, {
    deleteDeedPacket: (deedPacketId: number) => deleteResource(`deed-packets/${deedPacketId}`)
})
@UsersHOC()
@DeedPacketsHOC()
@PanelHOC('Deed Packets', [(props: DeedPacketsProps) => props.deedPackets, (props: DeedPacketsProps) => props.users])
export class ListDeedPackets extends React.PureComponent<DeedPacketsProps, {searchValue: string}> {

    constructor(props: DeedPacketsProps) {
        super(props);
        this.state = {
            searchValue: ''
        };
    }
    render() {
        const packets = this.props.deedPackets.data;

        return (
            <div>
                <ButtonToolbar>
                    <Link to="/deeds/create" className="btn btn-success"><Icon iconName="plus" />&nbsp;&nbsp;Create Deed Packet</Link>
                </ButtonToolbar>

                <div>
                    <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={(e: any) => this.setState({searchValue: e.target.value})} />
                </div>

                <Table headings={HEADINGS}>
                    {packets.map(packet => {
                        const titleRow = (
                            <tr>
                                <th colSpan={5}>{packet.title}</th>
                                    <td>
                                        <ButtonToolbar>
                                            <Link to={`/deeds/${packet.id}/edit`} className="btn btn-default btn-sm">Edit</Link>
                                            <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteDeedPacket(packet.id)}>Delete</Button>
                                        </ButtonToolbar>
                                    </td>
                            </tr>
                        );

                        const recordRows = packet.records.map(record => {
                            const createdBy = this.props.users.data.find(u => u.id === record.createdByUserId);

                            return (
                                <tr key={record.id}>
                                    <td>{record.id}</td>
                                    <td>{record.documentName}</td>
                                    <td>{formatDate(record.documentDate)}</td>
                                    <td>{record.matterId}</td>
                                    <td>{name(createdBy)}</td>
                                    <td>
                                        <ButtonToolbar>
                                            <Link to={`/deeds/records/${record.id}/edit`} className="btn btn-default btn-sm">Edit</Link>
                                            <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteDeedPacket(packet.id)}>Delete</Button>
                                        </ButtonToolbar>
                                    </td>
                                </tr>
                            );
                        });

                        return [titleRow, ...recordRows];
                    })}
                </Table>
            </div>
        );
    }
}

interface CreateDeedPacketProps {
    submit: (data: React.FormEvent<Form>) => void;
}

interface DeedPacketFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
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
export class CreateDeedPacket extends React.PureComponent<CreateDeedPacketProps> {
    render() {
        return <CreateDeedPacketForm onSubmit={this.props.submit} saveButtonText="Create Deed Packet" />;
    }
}


interface UnwrapperEditDeedPacketProps {
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
@PanelHOC('Edit Deed Packet', [(props: UnwrapperEditDeedPacketProps) => props.deedPacket])
class UnwrapperEditDeedPacket extends React.PureComponent<UnwrapperEditDeedPacketProps> {
    render() {
        return <EditDeedPacketForm onSubmit={this.props.submit} initialValues={this.props.deedPacket.data} saveButtonText="Save Deed Packet" />;
    }
}

export class EditDeedPacket extends React.PureComponent<{params: {deedPacketId: number}}> {
    render() {
        return <UnwrapperEditDeedPacket deedPacketId={this.props.params.deedPacketId} />;
    }
}

const EditDeedPacketForm = reduxForm({
    form: 'edit-deed-packet-form',
    validate: values => validate(deedPacketValidationRules, values)
})(DeedPacketForm);