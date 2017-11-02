import * as React from 'react';
import { Combobox, DatePicker, InputField, SelectField, TextArea, DocumentList } from '../form-fields';
import { validate } from '../utils/validation';
import { reduxForm, change } from 'redux-form';
import { push } from 'react-router-redux';
import { createResource, createNotification, updateResource, deleteResource, confirmAction } from '../../actions';
import { Form, Button, ButtonToolbar, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { DeedPacketRecordHOC, OfficesHOC, DeedPacketsHOC } from '../hoc/resourceHOCs';
import PanelHOC from '../hoc/panelHOC';
import MapParamsToProps from '../hoc/mapParamsToProps';
import { Link } from 'react-router';
import Icon from '../icon';
import { DATE_FORMAT } from '../utils';
import * as moment from 'moment';


interface EditDeedRecordProps {
    submit?: (data: React.FormEvent<Form>) => void;
    recordId: number;
    record?: EL.Resource<EL.DeedRecord>;
    offices?: EL.Resource<EL.Office[]>;
    deedPackets?: EL.Resource<EL.DeedPacket[]>;
}

interface CreateDeedRecordProps {
    submit?: (data: React.FormEvent<Form>) => void;
    offices?: EL.Resource<EL.Office[]>;
    deedPackets?: EL.Resource<EL.DeedPacket[]>;
}

interface DeedRecordFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    saveButtonText: string;
}


@MapParamsToProps(['recordId'])
@(connect(
    undefined,
    (dispatch: Function, ownProps: { recordId: number }) => ({
        submit: (data: React.FormEvent<Form>) => {
            const url = `deed-packet-records/${ownProps.recordId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Deed packet record updated.'), (response) => push(`/deeds/records/${ownProps.recordId}`)],
                onFailure: [createNotification('Deed packet record update failed. Please try again.', true)],
            };

            return dispatch(updateResource(url, data, meta))
        }
    })
) as any)
@DeedPacketRecordHOC()
@DeedPacketsHOC()
@OfficesHOC()
@PanelHOC<EditDeedRecordProps>('Edit Deed Record', props => [props.record, props.offices, props.deedPackets])
export class EditDeedRecord extends React.PureComponent<EditDeedRecordProps> {
    render() {
        return <EditDeedRecordForm
            onSubmit={this.props.submit}
            initialValues={this.props.record.data}
            deedPackets={this.props.deedPackets.data}
            saveButtonText="Save Deed Packet"
            offices={this.props.offices.data} />;
    }
}

const deedRecordValidationRules: EL.IValidationFields = {
    deedPacketId: { name: 'Deed packet', required: true },
    documentName: { name: 'Document name', required: true },
    documentDate: { name: 'Document date', required: true, isDate: true },
    parties: { name: 'Parties', required: true },
    matterId: { name: 'Matter ID', required: true },
    destructionDate: { name: 'Destruction date', required: false, isDate: true },
    officeLocationId: { name: 'Office location', required: false },
};

interface DeedRecordFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    saveButtonText: string;
    offices: EL.Office[];
    deedPackets: EL.DeedPacket[];
    delete?: () => void;
    changeDestructionDate: (newDate: string) => void;
}

@(connect(
    undefined,
    (dispatch, ownProps: { form: string }) => ({
        changeDestructionDate: (newDate: string) => dispatch(change(ownProps.form, 'destructionDate', newDate))
    })
) as any)
class DeedRecordForm extends React.PureComponent<DeedRecordFormProps> {
    constructor(props: DeedRecordFormProps) {
        super(props);
        this.renderDestructionDateHelp = this.renderDestructionDateHelp.bind(this);
    }

    renderDestructionDateHelp() {
        const sevenYears = moment().add(7, 'years').format(DATE_FORMAT);
        const twelveYears = moment().add(12, 'years').format(DATE_FORMAT);

        return (
            <div className="link-toolbar">
                <a onClick={() => this.props.changeDestructionDate(null)}>DND</a>
                <a onClick={() => this.props.changeDestructionDate(sevenYears)}>7 years</a>
                <a onClick={() => this.props.changeDestructionDate(twelveYears)}>12 years</a>
            </div>
        )
    }

    render() {
        const packetOptions = this.props.deedPackets.map(packet => ({ value: packet.id, text: packet.title }));
        const officeOptions = [
            { value: null, text: '' },
            ...this.props.offices.map(office => ({ value: office.id, text: office.name }))
        ];
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <SelectField name="deedPacketId" label="Deed Packet" options={packetOptions} required />
                <InputField name="documentName" label="Document Name" type="text" required />
                <DatePicker name="documentDate" label="Document Date" required />
                <InputField name="parties" label="Parties" type="text" required />
                <InputField name="matterId" label="Matter ID" type="text" required />
                <DatePicker name="destructionDate" label="Destruction Date" help={this.renderDestructionDateHelp()} />
                <SelectField name="officeLocationId" label="Office Locations" options={officeOptions} />
                <TextArea name="notes" label="Notes" />
                <DocumentList name="files" label="Documents" />
                <hr />

                <Row>
                    <Col md={11}>
                        <ButtonToolbar className="pull-right">
                            <Button bsStyle="primary" type="submit">{this.props.saveButtonText}</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const EditDeedRecordForm = reduxForm({
    form: EL.FormNames.EDIT_DEED_RECORD,
    validate: values => validate(deedRecordValidationRules, values)
})(DeedRecordForm);

const CreateDeedRecordForm = reduxForm({
    form: EL.FormNames.CREATE_DEED_RECORD,
    validate: values => validate(deedRecordValidationRules, values)
})(DeedRecordForm);

@(connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>) => {
            const url = `deed-packet-records`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Deed record created.'), (response) => push(`/deeds/records/${response.recordId}`)],
                onFailure: [createNotification('Deed record creation failed. Please try again.', true)],
            };
            return createResource(url, data, meta)
        }
    }
) as any)
@OfficesHOC()
@DeedPacketsHOC()
@PanelHOC<CreateDeedRecordProps>('Create Deed Record', props => [props.offices, props.deedPackets])
export class CreateDeedRecord extends React.PureComponent<CreateDeedRecordProps> {
    render() {
        const initialValues : any = {};
        if(this.props.deedPackets.data && this.props.deedPackets.data.length){
            initialValues.deedPacketId = this.props.deedPackets.data[0].id;
        }
        return <CreateDeedRecordForm onSubmit={this.props.submit} deedPackets={this.props.deedPackets.data} saveButtonText="Create Deed Record" offices={this.props.offices.data} initialValues={initialValues}/>;
    }
}

interface DeedRecordProps {
    deedPackets: EL.Resource<EL.DeedPacket[]>;
    record: EL.Resource<EL.DeedRecord>;
    delete: (recordId: number, packetId: number) => void;
    offices: EL.Resource<EL.Office[]>;
}

@(connect(
    undefined,
    {
        delete: (recordId: number, packetId: number) => {
            const deleteAction = deleteResource(`deed-packet-records/${recordId}`, {
                onSuccess: [createNotification('Deed record deleted.'), (response) => push(`/deeds/${packetId}`)],
                onFailure: [createNotification('Deed record deletion failed. Please try again.', true)],
            });

            return confirmAction({
                title: 'Confirm Delete Deed Record',
                content: 'Are you sure you want to delete this deed record?',
                acceptButtonText: 'Delete',
                declineButtonText: 'Cancel',
                onAccept: deleteAction
            });
        }
    }
) as any)
@MapParamsToProps(['recordId'])
@DeedPacketRecordHOC()
@DeedPacketsHOC()
@OfficesHOC()
@PanelHOC<DeedRecordProps>('Deed Record', props => [props.record, props.deedPackets, props.offices])
export class DeedRecord extends React.PureComponent<DeedRecordProps> {
    render() {
        const deedRecord = this.props.record.data;
        const deedPackets = this.props.deedPackets.data;
        const offices = this.props.offices.data;

        return (
            <div>
                <ButtonToolbar className="pull-right">
                    <Link to={`/deeds/records/${deedRecord.id}/edit`} className="btn btn-sm btn-default"><Icon iconName="pencil-square-o" />Edit</Link>
                    <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.delete(deedRecord.id, deedRecord.deedPacketId)}><Icon iconName="trash" />Delete</Button>
                </ButtonToolbar>

                <h3>{deedRecord.documentName}</h3>

                <dl>
                    <dt>Deed Packet</dt>
                    <dd>{deedPackets.find(packet => packet.id === deedRecord.deedPacketId).title}</dd>

                    <dt>Document Date</dt>
                    <dd>{deedRecord.documentDate}</dd>

                    <dt>Parties</dt>
                    <dd>{deedRecord.parties}</dd>

                    <dt>Matter ID</dt>
                    <dd>{deedRecord.matterId}</dd>

                    <dt>Destruction Date</dt>
                    <dd>{deedRecord.destructionDate || '—'}</dd>

                    <dt>Location</dt>
                    <dd>{(offices.find(office => office.id === deedRecord.officeLocationId) || { name: '—' }).name}</dd>

                    <dt>Notes</dt>
                    <dd>{deedRecord.notes || '—'}</dd>

                    <dt>Documents</dt>
                    <dd>{ deedRecord.files.map((file, i) => {
                        return <a key={file.id} href={`/api/files/${file.id}`}>{file.filename}</a>
                    }) } </dd>
                </dl>
            </div>
        );
    }
}