import * as React from 'react';
import { ButtonToolbar, Form, FormControl, Button, Col, Row } from 'react-bootstrap';
import Table from '../dataTable';
import { Link } from 'react-router';
import Icon from '../icon';
import PanelHOC from '../hoc/panelHOC';
import { DeedPacketsHOC, DeedPacketHOC, UsersHOC, ContactsHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { createResource, deleteResource, createNotification, updateResource } from '../../actions';
import { name, formatDate } from '../utils';
import { Combobox, DatePicker, InputField, SelectField } from '../form-fields';
import { validate } from '../utils/validation';
import { reduxForm, FieldArray } from 'redux-form';
import { push } from 'react-router-redux';
import MapParamsToProps from '../hoc/mapParamsToProps';

interface DeedPacketsProps {
    users: EL.Resource<EL.User[]>;
    deedPackets: EL.Resource<EL.DeedPacket[]>;
}

interface ListDeedPacketsState {
    searchValue: string
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

@UsersHOC()
@DeedPacketsHOC()
@PanelHOC<DeedPacketsProps, ListDeedPacketsState>('Deed Packets', props => [props.deedPackets, props.users])
export class ListDeedPackets extends React.PureComponent<DeedPacketsProps, ListDeedPacketsState> {
    constructor(props: DeedPacketsProps) {
        super(props);
        this.state = {
            searchValue: ''
        };
    }

    render() {
        const searchValue = this.state.searchValue;

        function isSearchMatch(value) {
            return value.toLowerCase().includes(searchValue.toLowerCase());
        }

        const packets = this.props.deedPackets.data.filter(packet => {
            if (searchValue === '') {
                return true;
            }

            if (isSearchMatch(packet.title)) {
                return true;
            }

            const records = packet.records;

            for (let index = 0; index < records.length; index++) {
                const record = records[index];

                if (isSearchMatch(record.documentName)) {
                    return true;
                }

                if (isSearchMatch(record.matterId)) {
                    return true;
                }

                if (isSearchMatch(record.parties)) {
                    return true;
                }
            }

            return false;
        });

        return (
            <div>
                <ButtonToolbar>
                    <Link to="/deeds/create" className="btn btn-default"><Icon iconName="plus" />&nbsp;&nbsp;Create Deed Packet</Link>
                    <Link to="/deeds/records/create" className="btn btn-default"><Icon iconName="plus" />&nbsp;&nbsp;Create Deed Record</Link>
                </ButtonToolbar>

                <div>
                    <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={(e: any) => this.setState({searchValue: e.target.value})} />
                </div>

                <Table headings={HEADINGS}>
                    {packets.map(packet => {
                        const titleRow = (
                            <tr>
                                <th>{packet.id}</th>
                                <th colSpan={4}>{packet.title}</th>
                                <td className="actions">
                                    <Link to={`/deeds/${packet.id}`}>View</Link>
                                    <Link to={`/deeds/${packet.id}/edit`}>Edit</Link>
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
                                    <td className="actions">
                                        <Link to={`/deeds/records/${record.id}`}>View</Link>
                                        <Link to={`/deeds/records/${record.id}/edit`}>Edit</Link>
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
    contacts?: EL.Resource<EL.Contact[]>;
}

interface DeedPacketFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    saveButtonText: string;
    contacts: EL.Contact[];
}

export const deedPacketValidationRules: EL.IValidationFields = {
    title: { name: 'title', required: true },
};

const renderContactsList = ({fields, meta, contactOptions}) => 
    <div className="clearfix">
        {fields.map((field, index) => <SelectField key={index} required name={field} label={`Contact #${index + 1}`} options={contactOptions} showRemoveButton={true} onRemoveButtonClick={() => fields.remove(index)} />)}
        
        <Row>
            <Col md={9} mdOffset={3}>
                <Button onClick={() => fields.push(1)}>Add Contact</Button>
            </Col>
        </Row>
    </div>

export class DeedPacketForm extends React.PureComponent<DeedPacketFormProps> {
    render() {
        const contactOptions = this.props.contacts.map(contact => ({ value: contact.id, text: contact.name }));

        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <InputField name="title" label="Title" type="text" required />

                <FieldArray name="contactIds" label="Contacts" component={renderContactsList} contactOptions={contactOptions} />

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
@ContactsHOC()
@PanelHOC<CreateDeedPacketProps>('Create Deed Packet', props => props.contacts)
export class CreateDeedPacket extends React.PureComponent<CreateDeedPacketProps> {
    render() {
        return <CreateDeedPacketForm onSubmit={this.props.submit} contacts={this.props.contacts.data} saveButtonText="Create Deed Packet" />;
    }
}


interface EditDeedPacketProps {
    submit?: (data: React.FormEvent<Form>) => void;
    clients?: EL.Resource<EL.Client[]>;
    deedPacketId: number;
    deedPacket?: EL.Resource<EL.DeedPacket>;
    contacts?: EL.Resource<EL.Contact[]>;
}

@MapParamsToProps(['deedPacketId'])
@(connect(
    undefined,
    (dispatch: Function, ownProps: { deedPacketId: number }) => ({
        submit: (data: React.FormEvent<Form>) => {
            const url = `deed-packets/${ownProps.deedPacketId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Deed packet updated.'), (response) => push('/deeds')],
                onFailure: [createNotification('Deed packet update failed. Please try again.', true)],
            };

            return dispatch(updateResource(url, data, meta));
        }
    })
) as any)
@DeedPacketHOC()
@ContactsHOC()
@PanelHOC<EditDeedPacketProps>('Edit Deed Packet', props => [props.deedPacket, props.contacts])
export class EditDeedPacket extends React.PureComponent<EditDeedPacketProps> {
    render() {
        return <EditDeedPacketForm onSubmit={this.props.submit} contacts={this.props.contacts.data} initialValues={this.props.deedPacket.data} saveButtonText="Save Deed Packet" />;
    }
}

const EditDeedPacketForm = reduxForm({
    form: 'edit-deed-packet-form',
    validate: values => validate(deedPacketValidationRules, values)
})(DeedPacketForm);

interface DeedPacketProps {
    deedPacket: EL.Resource<EL.DeedPacket>;
}

@MapParamsToProps(['deedPacketId'])
@DeedPacketHOC()
@PanelHOC<DeedPacketProps>('Deed Packet', props => props.deedPacket)
export class DeedPacket extends React.PureComponent<DeedPacketProps> {
    render() {
        return (
            <div>
                <h2>{this.props.deedPacket.data.title}</h2>
            </div>
        );
    }
}