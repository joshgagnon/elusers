import * as React from 'react';
import { connect } from '../utils/connect';
import PanelHOC from '../hoc/panelHOC';
import { MattersHOC, MatterHOC } from '../hoc/resourceHOCs';
import * as moment from 'moment';
import { createNotification, createResource, deleteResource, updateResource, confirmAction } from '../../actions';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';
import Table from '../dataTable';
import { Link } from 'react-router';
import Icon from '../icon';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField } from '../form-fields';
import { reduxForm, formValueSelector } from 'redux-form';
import { validate } from '../utils/validation';
import { push } from 'react-router-redux';
import { fullname, name } from '../utils';
import MapParamsToProps from '../hoc/mapParamsToProps';




interface  MattersProps {
      matters: EL.Resource<EL.Matter[]>;
}
interface  MattersViewProps {
      matters: EL.Matter[];
}

export const MATTER_TYPES = [
    "Bankruptcy and Liquidation",
    "Business Acquisitions and Investment",
    "Commercial Advice",
    "Commercial Documentation",
    "Company Governance and Shareholding",
    "Company Incorporation and Administration",
    "Conveyancing – Sale / Purchase",
    "Conveyancing – Refinance",
    "Criminal Process",
    "Debt Recovery",
    "Disputes and Litigation",
    "Employment",
    "General Advice",
    "Insolvency Advice",
    "Relationship Property",
    "Property Advice",
    "Wills and Estates",
    "Trust Advice",
    "Trust Creation and Administration"
];




const HEADINGS = ['Matter Number', 'Name', 'Type', 'Created By', 'Actions'];

class MattersTable extends React.PureComponent<MattersViewProps> {
    render() {


        return (
            <div>
                <ButtonToolbar>
                    <Link to="/matters/create" className="btn btn-primary"><Icon iconName="plus" />Create Matter</Link>
                </ButtonToolbar>

                <Table headings={HEADINGS} lastColIsActions>
                    { this.props.matters.map((matter: EL.Matter, index: number) => {
                        return <tr key={index}>
                        <td>{matter.matterNumber}</td>
                        <td>{matter.matterName}</td>
                        <td>{matter.matterType}</td>
                        <td>{matter.createdAt}</td>


                        <td>
                        <Link to={`/matters/${matter.id}`} className="btn btn-sm btn-default"><Icon iconName="eye" />View</Link>

                        </td>

                        </tr> }) }
                </Table>
            </div>
        );
    }
}

@MattersHOC()
@PanelHOC<MattersProps>('Matters', props => [props.matters])
export class ListMatters extends React.PureComponent<MattersProps> {

    render() {
        return (
                <MattersTable matters={this.props.matters.data}/>

        );
    }
}

interface MatterProps {
    matter: EL.Resource<EL.Matter>;
    matterId: string;
    deleteMatter: (matterId: string) => any;
}

@connect(undefined, {
    deleteMatter: (matterId: string) => {
        const deleteAction = deleteResource(`matters/${matterId}`, {
            onSuccess: [createNotification('Matter deleted.'), (response) => push('/matters')],
            onFailure: [createNotification('Matter deletion failed. Please try again.', true)],
        });

        return confirmAction({
            title: 'Confirm Delete Matter',
            content: 'Are you sure you want to delete this matter?',
            acceptButtonText: 'Delete',
            declineButtonText: 'Cancel',
            onAccept: deleteAction
        });
    }
})
@MapParamsToProps(['matterId'])
@MatterHOC()
@PanelHOC<MatterProps>('Matter', props => props.matter)
export class ViewMatter extends React.PureComponent<MatterProps> {

    render() {
        const matter = this.props.matter.data;
        return (
            <div>
                <ButtonToolbar className="pull-right">
                    <Link to={`/matters/${matter.id}/edit`} className="btn btn-sm btn-default"><Icon iconName="pencil-square-o" />Edit</Link>
                    <Button bsSize="small" bsStyle="danger" onClick={() => this.props.deleteMatter(this.props.matterId)}><Icon iconName="pencil-trash" />Delete</Button>
                </ButtonToolbar>

                <h3>{ matter.matterNumber }</h3>
                <h3>{ matter.matterName }</h3>
                <h4>{ matter.matterType }</h4>

                <dl>
                    <dt>Creator</dt>
                    <dd>{ name(matter.creator) }</dd>

                    <dt>Documents</dt>
                    <dd>{ (matter.files || []).map((file, i) => {
                        return <div key={file.id}><a target="_blank" href={`/api/files/${file.id}`}>{file.filename}</a></div>
                    }) } </dd>

                </dl>
            </div>
        );
    }
}



interface MatterFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    saveButtonText: string;
    form: string;
}

interface CreateMatterProps {
    submit: (data: React.FormEvent<Form>) => void;
}

interface EditMatterProps {
    submit: (data: React.FormEvent<Form>) => void;
}


class MatterForm extends React.PureComponent<MatterFormProps> {

    matterOptions = MATTER_TYPES.map(matter => {
        return {value: matter, text: matter};
    });

    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <InputField name="matterNumber" label="Matter Number" type="textl" required/>
                <InputField name="matterName" label="Matter Name" type="text" required/>

                <SelectField name="matterType" label="Type" options={this.matterOptions} required prompt/>


                <DocumentList name="files" label="Documents" />

                <hr />

                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Submit</Button>
                </ButtonToolbar>
            </Form>
        );
    }
}

const matterValidationRules: EL.IValidationFields = {
    matterNumber: { name: 'Matter Number', required: true },
    matterName: { name: 'Name', required: true },
    matterType: { name: 'Matter Type', required: true },
}

const CreateMatterForm = (reduxForm({
    form: EL.FormNames.CREATE_MATTER_FORM,
    validate: values => validate(matterValidationRules, values)
})(MatterForm as any) as any);

const EditMatterForm = (reduxForm({
    form: EL.FormNames.EDIT_MATTER_FORM,
    validate: values => validate(matterValidationRules, values)
})(MatterForm as any) as any);


@(connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>) => {
            const url = 'matters';
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Matter created.'), (response) => push(`/matters/${response.id}`)],
                onFailure: [createNotification('Matter creation failed. Please try again.', true)],
            };

            return createResource(url, data, meta)
        }
    }
) as any)
@PanelHOC<CreateMatterProps>('Create Matter')
export class CreateMatter extends React.PureComponent<CreateMatterProps> {
    render() {
        return <CreateMatterForm onSubmit={this.props.submit} saveButtonText="Create Matter" />
    }
}

interface UnwrappedEditMatterProps {
    submit?: (matterId: number, data: React.FormEvent<Form>) => void;
    matterId: number;
    matter?: EL.Resource<EL.Matter>;
}

@(connect(
    undefined,
    {
        submit: (matterId: number, data: React.FormEvent<Form>) => {
            const url = `matters/${matterId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Matter updated.'), (response) => push(`/matters/${matterId}`)],
                onFailure: [createNotification('Matter update failed. Please try again.', true)],
            };

            return updateResource(url, data, meta);
        }
    }
) as any)
@MatterHOC()
@PanelHOC<UnwrappedEditMatterProps>('Edit Matter', props => props.matter)
class UnwrappedEditMatter extends React.PureComponent<UnwrappedEditMatterProps> {
    render() {
        return <EditMatterForm initialValues={this.props.matter.data} onSubmit={data => this.props.submit(this.props.matterId, data)} saveButtonText="Save Matter" />
    }
}


export class EditMatter extends React.PureComponent<{ params: { matterId: number; } }> {
    render() {
        return <UnwrappedEditMatter matterId={this.props.params.matterId} />
    }
}
