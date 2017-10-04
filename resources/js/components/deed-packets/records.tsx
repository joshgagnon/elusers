import * as React from 'react';
import { Combobox, DatePicker, InputField } from '../form-fields';
import { validate } from '../utils/validation';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import { createResource, createNotification, updateResource } from '../../actions';
import { Form, Button, ButtonToolbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { DeedPacketRecordHOC, OfficesHOC } from '../hoc/resourceHOCs';
import PanelHOC from '../hoc/panelHOC';

interface UnwrapperEditDeedRecordProps {
    submit?: (data: React.FormEvent<Form>) => void;
    recordId: number;
    record?: EL.Resource<EL.DeedRecord>;
    offices?: EL.Resource<EL.Office[]>;
}

interface CreateDeedRecordProps {

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
@DeedPacketRecordHOC()
@OfficesHOC()
@PanelHOC('Edit Deed Packet Record', [(props: UnwrapperEditDeedRecordProps) => props.record, (props: UnwrapperEditDeedRecordProps) => props.offices])
class UnwrapperEditDeedRecord extends React.PureComponent<UnwrapperEditDeedRecordProps> {
    render() {
        return <EditDeedRecordForm onSubmit={this.props.submit} initialValues={this.props.record.data} saveButtonText="Save Deed Packet" officeNames={this.props.offices.data.map(office => office.name)} />;
    }
}

export class EditDeedRecord extends React.PureComponent<{params: {recordId: number}}> {
    render() {
        return <UnwrapperEditDeedRecord recordId={this.props.params.recordId} />;
    }
}

const deedRecordValidationRules: EL.IValidationFields = {
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
    officeNames: string[];
}

class DeedRecordForm extends React.PureComponent<DeedRecordFormProps> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <InputField name="documentName" label="Document Name" type="text" />
                <DatePicker name="documentDate" label="Document Date" />
                <InputField name="parties" label="Parties" type="text" />
                <InputField name="matterId" label="Matter ID" type="text" />
                <DatePicker name="destructionDate" label="Destruction Date" />
                <Combobox name="officeLocationId" label="Location" data={this.props.officeNames} />

                <hr />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">{this.props.saveButtonText}</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}

const EditDeedRecordForm = reduxForm({
    form: 'edit-deed-record-form',
    validate: values => validate(deedRecordValidationRules, values)
})(DeedRecordForm);