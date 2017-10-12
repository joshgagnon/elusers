import * as React from 'react';
import { Combobox, DatePicker, InputField, SelectField, TextArea } from '../form-fields';
import { validate } from '../utils/validation';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import { createResource, createNotification, updateResource } from '../../actions';
import { Form, Button, ButtonToolbar, Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { DeedPacketRecordHOC, OfficesHOC, DeedPacketsHOC } from '../hoc/resourceHOCs';
import PanelHOC from '../hoc/panelHOC';
import MapParamsToProps from '../hoc/mapParamsToProps';

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


@connect(
    undefined,
    (dispatch: Function, ownProps: { recordId: number }) => ({
        submit: (data: React.FormEvent<Form>) => {
            const url = `deed-packet-records/${ownProps.recordId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Deed packet record updated.'), (response) => push('/deeds')],
                onFailure: [createNotification('Deed packet record update failed. Please try again.', true)],
            };

            return dispatch(updateResource(url, data, meta))
        }
    })
)
@MapParamsToProps(['recordId'])
@DeedPacketRecordHOC()
@DeedPacketsHOC()
@OfficesHOC()
@PanelHOC<EditDeedRecordProps>('Edit Deed Record', props => [props.record, props.offices, props.deedPackets])
export class EditDeedRecord extends React.PureComponent<EditDeedRecordProps> {
    render() {
        return <EditDeedRecordForm onSubmit={this.props.submit} initialValues={this.props.record.data} deedPackets={this.props.deedPackets.data} saveButtonText="Save Deed Packet" offices={this.props.offices.data} />;
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
}

class DeedRecordForm extends React.PureComponent<DeedRecordFormProps> {
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
                <DatePicker name="destructionDate" label="Destruction Date" />
                <SelectField name="officeLocationId" label="Office Locations" options={officeOptions} />
                <TextArea name="notes" label="Notes" />

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
    form: 'edit-deed-record-form',
    validate: values => validate(deedRecordValidationRules, values)
})(DeedRecordForm);

const CreateDeedRecordForm = reduxForm({
    form: 'create-deed-record-form',
    validate: values => validate(deedRecordValidationRules, values)
})(DeedRecordForm);

@connect(
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
)
@OfficesHOC()
@DeedPacketsHOC()
@PanelHOC<CreateDeedRecordProps>('Create Deed Record', props => [props.offices, props.deedPackets])
export class CreateDeedRecord extends React.PureComponent<CreateDeedRecordProps> {
    render() {
        return <CreateDeedRecordForm onSubmit={this.props.submit} deedPackets={this.props.deedPackets.data} saveButtonText="Create Deed Record" offices={this.props.offices.data} />;
    }
}