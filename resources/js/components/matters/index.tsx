import * as React from 'react';
import { connect } from 'react-redux';
import PanelHOC from '../hoc/panelHOC';
import Panel from 'components/panel';
import { MattersHOC, MatterHOC } from '../hoc/resourceHOCs';
import { MatterDeadlines } from 'components/deadlines';
import * as moment from 'moment';
import { createNotification, createResource, deleteResource, updateResource, confirmAction, showUploadModal, showDocumentModal } from '../../actions';
import { Form, ButtonToolbar, Button, Col, Row, FormGroup, ControlLabel, Alert, FormControl, Table } from 'react-bootstrap';

import { Link } from 'react-router';
import Icon from '../icon';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';
import { reduxForm, formValueSelector, formValues, FieldArray, FormSection } from 'redux-form';
import { validate } from '../utils/validation';
import { push } from 'react-router-redux';
import { fullname, name, guessName, formatDate, formatDateTime } from '../utils';
import MapParamsToProps from '../hoc/mapParamsToProps';
import Referrer from './referrer';
import { ContactSelector } from '../contacts/contactSelector';
import { hasPermission } from '../utils/permissions';
import HasPermissionHOC from '../hoc/hasPermission';
import * as ReactList from 'react-list';
import { firstBy } from 'thenby'
import classnames from 'classnames';
import { DocumentsTree } from 'components/documents/documentsTree';


interface  MattersProps {
      matters: EL.Resource<EL.Matter[]>;
      showUploadModal: () => void;
}
interface  MattersViewProps {
      matters: EL.Matter[];
      showUploadModal: () => void;
}

export const CONVEYANCING_SALE_PURCHASER = "Conveyancing – Sale / Purchase";

export const MATTER_TYPES = [
    "Bankruptcy and Liquidation",
    "Business Acquisitions and Investment",
    "Commercial Advice",
    "Commercial Documentation",
    "Company Governance and Shareholding",
    "Company Incorporation and Administration",
    CONVEYANCING_SALE_PURCHASER,
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
    "Trust Creation and Administration",
    "Other"
];


interface ContactState {
    searchValue: string;
}

function filterData(search: string, data: EL.Matter[]) {
    if(search){
        search = search.toLocaleLowerCase();
        return data.filter(matter => {
            return (matter.matterClients  || []).map(matterClient => matterClient.client).some(contact => contact && fullname(contact).toLocaleLowerCase().includes(search)) ||
            //`ELF-${matter.id}`.toLocaleLowerCase().includes(search) ||
            matter.matterNumber.toLocaleLowerCase().includes(search) ||
            matter.matterName.toLocaleLowerCase().includes(search) ||
            matter.matterType.toLocaleLowerCase().includes(search)
        });
    }
    return data;
}

function sortData(data: EL.Matter[], column: string, sortDown: boolean) {
    const collator = new Intl.Collator(undefined, {numeric: column === 'matterNumber' || column === 'filesCount', sensitivity: 'base'});

    return data.sort(firstBy((a, b) => {
        if(!sortDown) {
            [b, a] = [a, b];
        }
        if(column === 'createdAt') {
            return ((new Date(a.createdAt).getTime()) - (new Date(b.createdAt).getTime()));
        }
        return collator.compare(a[column], b[column]);
    }));
}


const MATTER_STRINGS = {
    'matterNumber': 'Matter Number',
    'matterName': 'Name',
    'matterType': 'Type',
    'status': 'Status',
    'clients': 'Clients',
    'createdAt': 'Created',
    'filesCount': 'File Count',
    'actions': 'Actions'
}


const MATTER_SORTABLE = {
    'matterNumber': true,
    'matterName': true,
    'matterType': true,
    'status': true,
    'createdAt': true,
    'filesCount': true
}


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



class MattersTable extends React.PureComponent<MattersViewProps & {user: EL.User}, {searchValue: string, sortColumn: string, sortDown: boolean}> {
    state = {
        searchValue: '',
        sortColumn: 'createdAt',
        sortDown: true
    }

    sort(column: string) {
        if(this.state.sortColumn === column) {
            this.setState({sortDown: !this.state.sortDown})
        }
        else{
            this.setState({sortColumn: column});
        }
    }

    render() {
        const data = sortData(filterData(this.state.searchValue, this.props.matters), this.state.sortColumn, this.state.sortDown);
        return (
            <div>
                {  hasPermission(this.props.user, 'create matter')  && <ButtonToolbar>
                    <Link to="/matters/create" className="btn btn-primary"><Icon iconName="plus" />Create Matter</Link>
                    <Button onClick={this.props.showUploadModal}><Icon iconName="plus" />Upload Matter List</Button>
                </ButtonToolbar> }
                <div className="search-bar">
                    <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={(e: any) => this.setState({searchValue: e.target.value})} />
                </div>

                <div className="lazy-table">
                    <ReactList
                        type='variable'
                        useStaticSize={false}
                        threshold={200}
                        itemRenderer={(index) => {
                            const matter = data[index]; //cause the header
                            if(!matter){
                                return false;
                            }

                            return <tr key={index}>
                            {/* <td>ELF-{matter.id}</td> */ }
                            <td>{matter.matterNumber}</td>
                            <td>{matter.matterName}</td>
                            <td>{matter.matterType}</td>
                            <td><MatterStatus matter={matter}/></td>
                            <td>
                                { (matter.matterClients || []).map((matterClient, i) => {
                                    return matterClient.client && <div key={i}><Link to={`/contacts/${matterClient.client.id}`}>{ fullname(matterClient.client) } </Link></div>
                                }) }
                            </td>
                            <td>
                                { formatDate(matter.createdAt) }
                            </td>
                            <td>
                                { matter.filesCount }
                            </td>
                            <td>
                            <Link to={`/matters/${matter.id}`} className="btn btn-xs btn-default"><Icon iconName="eye" />View</Link>
                            {  hasPermission(this.props.user, 'edit matters')  && <Link to={`/matters/${matter.id}/edit`} className="btn btn-xs btn-warning"><Icon iconName="pencil" />Edit</Link> }

                            </td>

                        </tr>}}
                        itemsRenderer={(items, ref) => {
                            return <Table responsive>
                            <thead>
                                <tr>
                                    { ['matterNumber', 'matterName', 'matterType', 'status', 'clients', 'createdAt', 'filesCount'].map((heading: string, index) => {
                                        return <th key={index} onClick={MATTER_SORTABLE[heading] ? () => this.sort(heading) : undefined } className={MATTER_SORTABLE[heading] ? 'actionable' : ''}>
                                            { MATTER_STRINGS[heading] }
                                            { this.state.sortColumn === heading && this.state.sortDown && <Icon iconName="chevron-down" /> }
                                            { this.state.sortColumn === heading && !this.state.sortDown && <Icon iconName="chevron-up" /> }
                                           </th>
                                    }) }
                                    <th className="actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody ref={ref}>
                                { items }
                            </tbody>
                            </Table>

                        }}
                        length={data.length+1} // for the header
                      />
                      </div>
            </div>
        );
    }
}

@MattersHOC({cache:true})
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
    canUpdate: boolean;
    deleteMatter: (matterId: string) => any;
}

@PanelHOC<MatterProps>('Matter', props => props.matter)
class MatterDetails extends React.PureComponent<MatterProps> {
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
                        { (matter.matterClients || []).map((matterClient, i) => {
                            return <React.Fragment>

                           { matterClient.client && <div key={i}><Link to={`/contacts/${matterClient.client.id}`}>{ fullname(matterClient.client) } </Link></div> }
                            { matterClient.authorisedContact && <div key={i}>&nbsp;- Authorised Contact: <Link to={`/contacts/${matterClient.authorisedContact.id}`}>{ fullname(matterClient.authorisedContact) } </Link></div> }
                                 </React.Fragment>
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

                    { matter.matterType === CONVEYANCING_SALE_PURCHASER  && <React.Fragment>

                    <dt>Settlement Date</dt>
                    <dd>{ matter.matterFields && matter.matterFields.settlementDate ? formatDate(matter.matterFields.settlementDate) : 'Unknown'}</dd>

                    <dt>Condition Date</dt>
                    <dd>{ matter.matterFields && matter.matterFields.conditionDate? formatDate(matter.matterFields.conditionDate) : 'Unknown'}</dd>

                    </React.Fragment> }



                    <dt>Notes</dt>
                    <dd>{ (matter.notes || []).map((note, i) => {
                        return <div key={note.id}>{ name(note.creator) } -  {note.note}</div>
                    }) } </dd>
                </dl>
            </div>
        );
    }
}

interface MatterDocumentProps {
    matter: EL.Resource<EL.Matter>;
    matterId: string;
    canUpdate: boolean;
}

class MatterDocuments extends React.PureComponent<MatterDocumentProps> {
    render() {
        return <DocumentsTree
            title="Matter Documents"
            files={this.props.matter.data ? this.props.matter.data.files : []}
            matterId={this.props.matterId}
            basePath={`matters/${this.props.matterId}`}
            cached={this.props.matter.cached}
            canUpdate={this.props.canUpdate} />
    }
}

@(connect((state: EL.State) => ({
    canUpdate: hasPermission(state.user, 'edit matters')
}), {
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
@MatterHOC({cache: true})
export class ViewMatter extends React.PureComponent<MatterProps> {
    render() {
        return <React.Fragment>
            <Row>
                <Col md={6}>
                    <MatterDetails {...this.props} />
                </Col>
                <Col md={6}>
                    <MatterDeadlines {...this.props} />
               </Col>
               <Col md={12}>
                <MatterDocuments {...this.props} />
                </Col>
            </Row>
        </React.Fragment>
    }

}



interface MatterFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    saveButtonText: string;
    cancelLocation: string;
    form: string;
}

interface CreateMatterProps {
    submit: (data: React.FormEvent<Form>) => void;
}

interface EditMatterProps {
    submit: (data: React.FormEvent<Form>) => void;
}


const MatterClients = ({ fields, meta: { error, submitFailed } }) => (
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

        <ContactSelector name={`${contact}.contactId`}  label="Client" required/>
        <ContactSelector name={`${contact}.authorisedContactId`}  label="Authorised Person" />
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

interface MatterFieldsProps {
    matterType?: string;
}


@(formValues('matterType') as any)
class MatterFields extends React.PureComponent<MatterFieldsProps> {
    render() {

        if(this.props.matterType === CONVEYANCING_SALE_PURCHASER ) {
            return <FormSection name="matterFields">
                <DatePicker name="settlementDate" label="Settlement Date" />
                <DatePicker name="conditionDate" label="Condition Date" />
            </FormSection>
        }
        return false;
    }
}


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

                <MatterFields />

                <hr />
                <Referrer selector={formValueSelector(this.props.form)}/>

                <hr />



                <FieldArray name="matterClients" component={MatterClients as any} />

                <hr />
                {/* <DocumentList name="files" label="Documents" /> */ }

                <hr />

                <FieldArray name="notes" component={Notes as any} />
                <hr />


                <ButtonToolbar>
                    <Button bsStyle="primary" className="pull-right" type="submit">Submit</Button>
                    <Link className="btn btn-default pull-right" to={`${this.props.cancelLocation}`}>Cancel</Link>
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
    matterClients: { name: 'Client', minItems: 1, map: {id: { name: 'Client', required: true}}},
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
        return <CreateMatterForm cancelLocation={`/matters`} initialValues={{clients: [{}]}} onSubmit={this.props.submit} saveButtonText="Create Matter" />
    }
}

interface UnwrappedEditMatterProps {
    submit?: (matterId: string, data: React.FormEvent<Form>) => void;
    matterId: string;
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
@PanelHOC<UnwrappedEditMatterProps>('Edit Matter', props => props.matter)
class UnwrappedEditMatter extends React.PureComponent<UnwrappedEditMatterProps> {
    render() {
        return <EditMatterForm cancelLocation={`/matters/${this.props.matterId}`} initialValues={this.props.matter.data} onSubmit={data => this.props.submit(this.props.matterId, data)} saveButtonText="Save Matter" />
    }
}


@HasPermissionHOC('edit matters')
@MapParamsToProps(['matterId'])
@MatterHOC({cache: true})
export class EditMatter extends React.PureComponent< { matterId: string; matter: EL.Resource<EL.Matter>} > {
    render() {
        return <React.Fragment>
            <UnwrappedEditMatter {...this.props} />
            <MatterDocuments {...this.props}  canUpdate={true} />
            </React.Fragment>
    }
}

