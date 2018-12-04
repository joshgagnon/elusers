import * as React from 'react';
import { connect } from 'react-redux';
import PanelHOC from '../hoc/panelHOC';
import { MattersHOC, MatterHOC } from '../hoc/resourceHOCs';
import * as moment from 'moment';
import { createNotification, createResource, deleteResource, updateResource, confirmAction, showUploadModal } from '../../actions';
import { Form, ButtonToolbar, Button, Col, FormGroup, ControlLabel, Alert, FormControl } from 'react-bootstrap';
import Table from '../dataTable';
import { Link } from 'react-router';
import Icon from '../icon';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';
import { reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate } from '../utils/validation';
import { push } from 'react-router-redux';
import { fullname, name, guessName, formatDate } from '../utils';
import MapParamsToProps from '../hoc/mapParamsToProps';
import Referrer from './referrer';
import { ContactSelector } from '../contacts/contactSelector';
import { hasPermission } from '../utils/permissions';
import HasPermissionHOC from '../hoc/hasPermission';

interface  MattersProps {
      matters: EL.Resource<EL.Matter[]>;
      showUploadModal: () => void;
}
interface  MattersViewProps {
      matters: EL.Matter[];
      showUploadModal: () => void;
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


interface ContactState {
    searchValue: string;
}

function filterData(search: string, data: EL.Matter[]) {
    if(search){
        search = search.toLocaleLowerCase();
        return data.filter(matter => {
            return matter.clients.some(contact => fullname(contact).toLocaleLowerCase().includes(search)) ||
            `ELF-${matter.id}`.toLocaleLowerCase().includes(search) ||
            matter.matterNumber.toLocaleLowerCase().includes(search) ||
            matter.matterName.toLocaleLowerCase().includes(search) ||
            matter.matterType.toLocaleLowerCase().includes(search)
        });
    }
    data.sort((a, b) => a.matterNumber.localeCompare(b.matterNumber));
    return data;
}


const HEADINGS = ['ELF #', 'Matter Number', 'Name', 'Type', 'Status', 'Clients', 'Actions'];

const MatterStatus = ({matter} : {matter: EL.Matter}) => {
    let className = 'text-danger';
    if(matter.status === 'Unapproved') {
        className = 'text-warning';
    }
    if(matter.status === 'Active') {
        className = 'text-success';
    }
    return <span className={className}>{ matter.status }</span>

}



class MattersTable extends React.PureComponent<MattersViewProps & {user: EL.User}, {searchValue: string}> {
    state = {
        searchValue: ''
    }

    render() {
        const data = filterData(this.state.searchValue, this.props.matters);
        return (
            <div>
                {  hasPermission(this.props.user, 'create matter')  && <ButtonToolbar>
                    <Link to="/matters/create" className="btn btn-primary"><Icon iconName="plus" />Create Matter</Link>
                    <Button onClick={this.props.showUploadModal}><Icon iconName="plus" />Upload Matter List</Button>
                </ButtonToolbar> }
                <div className="search-bar">
                    <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={(e: any) => this.setState({searchValue: e.target.value})} />
                </div>
                <Table headings={HEADINGS} lastColIsActions>
                    { data.map((matter: EL.Matter, index: number) => {
                        return <tr key={index}>
                        <td>ELF-{matter.id}</td>
                        <td>{matter.matterNumber}</td>
                        <td>{matter.matterName}</td>
                        <td>{matter.matterType}</td>
                        <td><MatterStatus matter={matter}/></td>
                        <td>
                            { (matter.clients || []).map((client, i) => {
                                return <div key={i}><Link to={`/contacts/${client.id}`}>{ fullname(client) } </Link></div>
                            }) }
                        </td>


                        <td>
                        <Link to={`/matters/${matter.id}`} className="btn btn-sm btn-default"><Icon iconName="eye" />View</Link>
                        {  hasPermission(this.props.user, 'edit matters')  && <Link to={`/matters/${matter.id}/edit`} className="btn btn-sm btn-warning"><Icon iconName="pencil" />Edit</Link> }

                        </td>

                        </tr> }) }
                </Table>
            </div>
        );
    }
}

@MattersHOC()
@(connect((state: EL.State) => ({user: state.user}), {
    showUploadModal: () => showUploadModal({uploadType: 'matters'})
}) as any)
@PanelHOC<MattersProps & {user: EL.User}>('Matters', props => [props.matters])
export class ListMatters extends React.PureComponent<MattersProps & {user: EL.User} > {

    render() {
        return (
                <MattersTable matters={this.props.matters.data} user={this.props.user} showUploadModal={this.props.showUploadModal}/>

        );
    }
}

interface MatterProps {
    matter: EL.Resource<EL.Matter>;
    matterId: string;
    deleteMatter: (matterId: string) => any;
}

@(connect(undefined, {
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
}) as any)
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
                    <Button bsSize="small" bsStyle="danger" onClick={() => this.props.deleteMatter(this.props.matterId)}><Icon iconName="trash" />Delete</Button>
                </ButtonToolbar>

                <h3>{ matter.matterNumber }</h3>
                <h3>{ matter.matterName }</h3>
                <h4>{ matter.matterType }</h4>
                <h4><MatterStatus matter={matter}/></h4>

                <dl>
                    <dt>Clients</dt>
                    <dd>
                        { (matter.clients || []).map((client, i) => {
                            return <div key={i}><Link to={`/contacts/${client.id}`}>{ fullname(client) } </Link></div>
                        }) }

                    </dd>

                    <dt>Created At</dt>
                    <dd>{ formatDate(matter.createdAt) }</dd>

                    <dt>Updated At</dt>
                    <dd>{ formatDate(matter.updatedAt) }</dd>

                    <dt>Creator</dt>
                    <dd>{ name(matter.creator) }</dd>

                    <dt>Referrer</dt>
                    <dd>{ matter.referrer ? guessName(matter.referrer) : 'None'}</dd>

                    <dt>Documents</dt>
                    <dd>{ (matter.files || []).map((file, i) => {
                        return <div key={file.id}><a target="_blank" href={`/api/files/${file.id}`}>{file.filename}</a></div>
                    }) } </dd>

                    <dt>Notes</dt>
                    <dd>{ (matter.notes || []).map((note, i) => {
                        return <div key={note.id}>{ name(note.creator) } -  {note.note}</div>
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


const Clients = ({ fields, meta: { error, submitFailed } }) => (
  <div>
    { fields.map((contact, index) => (
      <div key={index}>
        <div>
            <h4 className="text-center">Client #{ index+1 }
            <Button style={{marginLeft: 20}} className="btn-icon-only" bsSize="small" onClick={() => fields.remove(index)}>
                    <Icon iconName="times" />
            </Button>
            </h4>
        </div>
        <ContactSelector name={`${contact}.id`}  label="Client" required/>
      </div>
    )) }

      <div className="button-row">
          <Button onClick={() => fields.push({})}>
        Add Client
        </Button>
      </div>

      { error && <Alert  bsStyle="danger"><p className="text-center">{ error }</p> </Alert> }

  </div>
)

const Notes = ({ fields, meta: { error, submitFailed } }) => (
  <div>
    { fields.map((note, index) => (
        <FormGroup key={index}>
            <Col componentClass={ControlLabel} md={3}>
                Note
            </Col>
            <Col md={8}>
                    <TextArea name={`${note}.note`}  naked required />
            </Col>
            <Col md={1}>
                <Button className="btn-icon-only" onClick={(e) => {
                        e.preventDefault();
                        fields.remove(index)
                      }}><Icon iconName="trash-o" /></Button>
            </Col>
            </FormGroup>


    )) }

      <div className="button-row">
          <Button onClick={() => fields.push({})}>
        Add Note
        </Button>
      </div>
      { error && <Alert  bsStyle="danger"><p className="text-center">{ error } </p></Alert> }
  </div>
)

class MatterForm extends React.PureComponent<MatterFormProps> {

    matterOptions = MATTER_TYPES.map(matter => {
        return {value: matter, text: matter};
    });

    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <InputField name="matterNumber" label="Matter Number" type="text" required/>
                <InputField name="matterName" label="Matter Name" type="text" required/>

                <SelectField name="status" label="Status" options={['Unapproved', 'Active', 'Closed', 'Inactive']} required prompt/>

                <SelectField name="matterType" label="Matter Type" options={this.matterOptions} required prompt/>
                <hr />
                <Referrer selector={formValueSelector(this.props.form)}/>

                <hr />



                <FieldArray name="clients" component={Clients as any} />
                <hr />
                <DocumentList name="files" label="Documents" />

                <hr />

                <FieldArray name="notes" component={Notes as any} />
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
    status: { name: 'Status', required: true },
    clients: { name: 'Client', minItems: 1, map: {id: { name: 'Client', required: true}}},
    notes: { name: 'Notes',  map: {note: { name: 'Note', required: true}}}
}

const validateMatter = values => {
    const errors = validate(matterValidationRules, values);
    console.log(errors)
    return errors;
}

const CreateMatterForm = (reduxForm({
    form: EL.FormNames.CREATE_MATTER_FORM,
    validate: validateMatter
})(MatterForm as any) as any);

const EditMatterForm = (reduxForm({
    form: EL.FormNames.EDIT_MATTER_FORM,
    validate: validateMatter
})(MatterForm as any) as any);




@HasPermissionHOC('create matter')
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
        return <CreateMatterForm initialValues={{clients: [{}]}} onSubmit={this.props.submit} saveButtonText="Create Matter" />
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

@HasPermissionHOC('edit matters')
export class EditMatter extends React.PureComponent<{ params: { matterId: number; } }> {
    render() {
        return <UnwrappedEditMatter  matterId={this.props.params.matterId} />
    }
}

