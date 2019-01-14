import * as React from 'react';
import { connect } from 'react-redux';
import PanelHOC from '../hoc/panelHOC';
import Panel from 'components/panel';
import { MattersHOC, MatterHOC } from '../hoc/resourceHOCs';
import * as moment from 'moment';
import { createNotification, createResource, deleteResource, updateResource, confirmAction, showUploadModal } from '../../actions';
import { Form, ButtonToolbar, Button, Col, FormGroup, ControlLabel, Alert, FormControl, Table } from 'react-bootstrap';

import { Link } from 'react-router';
import Icon from '../icon';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';
import { reduxForm, formValueSelector, FieldArray } from 'redux-form';
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

import { DragSource, DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';


const documentFileTarget = {
    drop(props, monitor) {
        if(props.documents.value){
            props.documents.onChange([...props.documents.value, ...monitor.getItem().files]);
        }
        else{
            props.documents.onChange(monitor.getItem().files);
        }
    }
};


const imageTarget = {
    drop(props, monitor) {
        props.onChange(monitor.getItem().files);
    }
};


class DocumentFormBase extends React.PureComponent<any> {
    isFileDialogActive = false;
    fileInputEl = null;
    open() {
        this.isFileDialogActive = true;
        this.fileInputEl.value = null;
        this.fileInputEl.click();
    }

    onDrop(e) {
        const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if(this.props.documents){
            this.props.documents.onChange([...(this.props.documents.value || []), ...droppedFiles]);
        }
        else{
            this.props.onChange(droppedFiles);
        }
    }

    onFileDialogCancel() {
        // timeout will not recognize context of this method
        const { onFileDialogCancel } = this.props;
        const { fileInputEl } = this;
        let { isFileDialogActive } = this;
        // execute the timeout only if the onFileDialogCancel is defined and FileDialog
        // is opened in the browserextends Re
        if (onFileDialogCancel && isFileDialogActive) {
          setTimeout(() => {
            // Returns an object as FileList
            const FileList = fileInputEl.files;
            if (!FileList.length) {
              isFileDialogActive = false;
              onFileDialogCancel();
            }
          }, 300);
        }
    }

    render() {
        const documents = this.props.documents;
        const { connectDropTarget, isOver, canDrop } = this.props;
        let className="dropzone";
        if(isOver && !canDrop){
            className += ' reject';
        }
        else if(isOver && canDrop){
            className += ' accept';
        }
        const inputAttributes = {
            type: 'file',
            style: { display: 'none' },
            multiple: true,
            ref: el => this.fileInputEl = el,
            onChange: (e) => this.onDrop(e)
        };
        return <div>
            { this.props.label && <label className="control-label">{ this.props.label }</label>}

                { connectDropTarget(<div className="dropzone" onClick={() => this.open()}>
                                        <div>Drop files here to upload or <a className="vanity-link" href="#">click to browse</a> your device</div>
                  <input {...inputAttributes} />
            </div>) }
          {/* }{((documents|| {}).value || []).map((file, i) => {
                if(file.type && file.type === 'Directory'){
                    return false;
                }
                return  <StaticField type="static" key={i} label="File" key={i}
                hasFeedback groupClassName='has-group' value={file.name || file.filename}
                buttonAfter={<button className="btn btn-default" onClick={(e) => {
                    e.preventDefault();
                    const clone = documents.value.slice();
                    clone.splice(i, 1);
                    documents.onChange(clone);
                }}><Icon iconName='trash'/></button>} />

            }) } */ }
           </div>
        }
}


export const DocumentsForm = (DropTarget(NativeTypes.FILE, documentFileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
})) as any)(DocumentFormBase);





const documentTypeClasses = (doc, showingSubTree) => {
    const map = {
        'Directory': 'fa fa-folder-o',
        'Companies Office': 'fa fa-file-text',
        'image/png': 'fa fa-file-image-o',
        'image/jpeg': 'fa fa-file-image-o',
        'application/pdf': 'fa fa-file-pdf-o',
        'application/msword': 'fa fa-file-word-o',
        'application/gzip': 'fa-file-archive-o',
        'application/zip': 'fa-file-archive-o'
    };

    if(doc.directory){
        if(!doc.protected){
            if(showingSubTree){
                return 'fa fa-folder-open-o'
            }
            return 'fa fa-folder-o'
        }
        if(showingSubTree){
            return 'fa fa-folder-open'
        }
        return 'fa fa-folder';
    }

    return map[doc.type] || 'fa fa-file-text';
}

function listToTree(documents: EL.Document[]){
    const roots = [];
    const map = documents.reduce((acc, d) => {
        acc[d.id] = {...d, children: []};
        return acc;
    }, {});
    documents.map(d => {
        if(!d.parentId || !map[d.parentId]){
            roots.push(map[d.id]);
        }
        else{
            map[d.parentId].children.push(map[d.id]);
        }
    });
    return [{
            id: 'root',
            directory: true,
            protected: true,
            filename: 'Documents',
            children: roots
        }]
}

function filterTree(value, tree) {
    if(!value){
        return tree;
    }
    function filter(value, tree){
        return (tree || []).map(node => {
            const children = filter(value, node.children);
            const newNode = {...node, children};
            let found = !!children.length;
            if(node.filename.toLocaleLowerCase().indexOf(value) > -1){
                found = true;
            }
            return found && newNode;
        }).filter(f => f)
    }
    const newTree = filter(value, tree);
    return newTree;
}


const fileSource = {
  beginDrag(props) {
    return {
      id: props.item.id,
      parentId: props.item.parentId
    };
  }
};

const fileTarget = {
    drop(props, monitor) {
        const newParentid = props.item.id === 'root' ? null : props.item.id;
        const dragItem = monitor.getItem()
        if(!dragItem.id && dragItem.files){
            if(!monitor.didDrop()) {
                props.showSubTree(newParentid);
                props.path.map(id =>  props.showSubTree(id))
                props.upload(dragItem.files, newParentid);
                return;
            }
        }
        if(newParentid === dragItem.id){
            return;
        }
        if(dragItem.parentId === newParentid){
            return;
        };
        if(props.path.indexOf(dragItem.id) > -1){
            return;
        }
        if(!monitor.didDrop()){
            props.showSubTree(newParentid);
            props.path.map(id =>  props.showSubTree(id))
            props.move(dragItem.id, newParentid);
            // always show parents on drop, so we can select result when upload finished
        }
    },
    canDrop(props, monitor) {
        return true;
    }


}

const FILE = 'FILE';

@(DropTarget((props) => props.accepts, fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
})) as any)
@(DragSource(FILE, fileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})) as any)
class RenderFile extends React.PureComponent<any> {
    input = null;

    render() {
        const props = this.props;
        const { item, link, push, renameFile, deleteFile, startRename, endRename, createDirectory, startCreateFolder, endCreateFolder } = props;
        const { isDragging, connectDragSource, connectDropTarget, isOver, canDrop } = props;
        const showingSubTree =  props.showingSubTree || (canDrop && isOver);

        if(item.deleted){
            return false;
        }

        const defaultView = () => {
            return  <span>{ !item.directory && <span onClick={() => push(link)} className="view">View</span> }
                    { this.props.canUpdate && !item.protected && <span onClick={() => startRename(item.id)} className="view">Rename</span> }
                    { this.props.canUpdate && !item.protected && <span onClick={() => deleteFile(item.id)} className="view">Delete</span> }</span>
        }

        const submitRename = () => {
            const value = this.input.value;
            if(value){
                renameFile(item.id, value);
                endRename();
            }
        }

        const submitCreateFolder = () => {

            const value = this.input.value;
            if(value){
                createDirectory(item.id === 'root' ? null : item.id, value);
                endCreateFolder();
            }
        }

        const showNew = () => {
            return <div className="file-sub-tree"><span className="expand-control"></span>
                    <span className="file" onClick={ startCreateFolder}>
                        <span className="icon fa fa-plus-circle"></span>
                        <span className="filename"><em>Create New Folder</em></span>
                    </span>
                </div>
        }

        const showNewForm = () => {
            // is.props.createDirectory(item.id === 'root' ? null : item.id, 'New Folder')
            return <div className="file-sub-tree"><span className="expand-control"></span>
                    <span className="file selected" >
                        <span className="icon fa fa-plus-circle"></span>
                        <FormGroup><FormControl type="text" placeholder={ 'New Folder' } inputRef={ref => { this.input = ref; }}  /></FormGroup>
                        <span onClick={submitCreateFolder} className="view">Create Folder</span>
                        <span onClick={endCreateFolder} className="view">Cancel</span>
                    </span>
                </div>
        }

        const fileSpan = () => <span className={classnames('file', {selected: props.selected, 'can-drop': canDrop && isOver})} onMouseDown={() => !props.selected && props.select()}>
                <span className={'icon ' + documentTypeClasses(item, showingSubTree)} />
                { !this.props.renaming && <span className="filename">{ item.filename } { !item.directory && item.createdAt ? ` - ${formatDateTime(item.createdAt)}` : '' }</span> }
                { !this.props.renaming && defaultView() }
                { this.props.renaming && <FormGroup><FormControl type="text" defaultValue={ item.filename } inputRef={ref => { this.input = ref; }} /></FormGroup> }
                { this.props.renaming && <span onClick={() => submitRename()} className="view">Save</span> }
                { this.props.renaming && <span onClick={() => endRename()} className="view">Cancel</span> }
                </span>

        const canCreateDirectory = this.props.canUpdate;
        const renderedFile = (<div className="file-sub-tree">
              <span className="expand-control">
                { item.directory  && showingSubTree && <span className="fa fa-minus-square-o" onClick={() => props.hideSubTree()} /> }
                { item.directory   && !showingSubTree && <span className="fa fa-plus-square-o" onClick={() => props.showSubTree()} /> }
              </span>
                { item.id !== "root" && !item.protected && !this.props.renaming ? connectDragSource(fileSpan()) : fileSpan() }
                { item.directory  &&
                    <div className={classnames("children", {"showing": showingSubTree})}>
                    { canCreateDirectory && !this.props.creatingFolder && showNew() }
                    { canCreateDirectory && this.props.creatingFolder && showNewForm() }
                    { props.children }
                    </div>
                }
            </div>)
        return connectDropTarget(renderedFile);
    }
}

const SearchForm = (props) => {
    return <div>
            <h3 className="panel-title">Documents</h3>
            <form className="form-inline pull-right">
            <FormGroup><FormControl type="text"  onChange={props.onSearchChange} placeholder="Search" value={props.filter}/></FormGroup>
            <div className="btn-group">
            <Button onClick={props.expandAll}>Expand All</Button>
            <Button onClick={props.collapseAll}>Collapse All</Button>
            </div>
        </form>
        </div>
}

class FileTree extends React.PureComponent<any> {
    state = {root: true, filter: '', creatingFolder: false, renaming: false, selected: false}
    constructor(props){
        super(props);
        this.expandAll = this.expandAll.bind(this);
        this.collapseAll = this.collapseAll.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.upload = this.upload.bind(this);
        this.move = this.move.bind(this);
        this.renameFile = this.renameFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.createDirectory = this.createDirectory.bind(this);
    }

    select(id) {
        this.setState({selected: id, renaming: false, creatingFolder: false});
    }

    startRename(id) {
        this.setState({renaming: id, selected: id})
    }

    endRename() {
        this.setState({renaming: false});
    }

    startCreateFolder(id) {
        this.setState({creatingFolder: id, selected: false});
    }

    endCreateFolder() {
        this.setState({creatingFolder: false});
    }

    showSubTree(id) {
        this.setState({[id]: true});
    }

    hideSubTree(id) {
        this.setState({[id]: false});
    }

    expandAll() {
        this.setState(this.props.flatFiles.reduce((acc, f) => {
            acc[f.id] = true;
            return acc;
        }, {}))
    }

    collapseAll() {
        this.setState(this.props.flatFiles.reduce((acc, f) => {
            acc[f.id] = false;
            return acc;
        }, {}))
    }

    onSearchChange(event) {
        const value = event.target.value;
        this.setState({filter: value});
    }

    move(...args){
        this.props.move(...args)
    }

    renameFile(...args){
        this.props.renameFile(...args)
    }

    deleteFile(...args){
        this.props.deleteFile(...args)
    }

    createDirectory(...args){
        this.props.createDirectory(...args)
    }

    upload(files, parentId=null) {
        if(!parentId){
            const target = this.state.selected && this.props.flatFiles.find(f => f.id === this.state.selected);
            if(target && target.userUploaded){
                parentId = target.directory ? target.id : target.parentId;
                parentId = parentId === 'root' ? null : parentId;
            }
        }
        parentId && this.showSubTree(parentId)
        this.props.upload(files, parentId)
    }

    render() {
        const loop = (data, path) => {
            return data.map((item) => {
                const link = this.props.companyId ? `/company/view/${this.props.companyId}/documents/view/${item.id}` : `/documents/view/${item.id}`;
                const props = {
                    key: item.id,
                    item: item,
                    link: link,
                    push: this.props.push,
                    accepts: item.directory ? [FILE, NativeTypes.FILE] : [],
                    fileTypes:  FILE,
                    select: () => this.select(item.id),
                    selected: !this.state.creatingFolder && this.state.selected === item.id,
                    renaming: !this.state.creatingFolder && this.state.selected === item.id && this.state.renaming === item.id,
                    showingSubTree: this.state[item.id] || !!this.state.filter,
                    showSubTree: (id) => this.showSubTree(id || item.id),
                    hideSubTree: (id) => this.hideSubTree(id || item.id),
                    move: this.move,
                    startRename: () => this.startRename(item.id),
                    endRename: () => this.endRename(),
                    renameFile: this.props.renameFile && this.renameFile,
                    deleteFile: this.props.deleteFile && this.deleteFile,
                    creatingFolder: this.state.creatingFolder === item.id,
                    startCreateFolder: () => this.startCreateFolder(item.id),
                    endCreateFolder: () => this.endCreateFolder(),
                    createDirectory: this.createDirectory,
                    upload: this.upload,
                    path: path,
                    canUpdate: this.props.canUpdate
                }
                if (item.children && item.children.length) {
                    const newPath = [...path, item.id];

                    item.children.sort(firstBy(doc => {
                        return doc.userUploaded ? 1 : 0
                    }).thenBy('filename').thenBy('id'))

                    return <RenderFile  {...props}>
                       { loop( item.children, newPath) }
                    </RenderFile>
                }

                return <RenderFile {...props} />;
            });
        };

        const files = filterTree(this.state.filter, this.props.files);
        return <Panel formattedTitle={ <SearchForm key="search" onSearchChange={this.onSearchChange} filter={this.state.filter} expandAll={this.expandAll} collapseAll={this.collapseAll} /> } className="document-panel">
            <div className="file-tree">
                { loop(files, []) }
            </div>
            { this.props.canUpdate && <DocumentsForm documents={{onChange: (files) => this.upload(files)}} /> }
         </Panel>
    }

}


@(connect(undefined,
 (dispatch, ownProps: any) => ({
    createNotification: (args) => dispatch(createNotification(args)),
    createDocuments: (data) => dispatch(createResource(`matter/${ownProps.matterId}/documents`, data)),
    updateDocument: (documentId, data) => dispatch(updateResource(`matter/${ownProps.matterId}/documents/${documentId}`, data)),
    deleteResource: (documentId) => dispatch(deleteResource(`matter/${ownProps.matterId}/documents/${documentId}`)),
    push: (url) => push(url)
})) as any)
export class DocumentsView extends React.PureComponent<any> {

    constructor(props) {
        super(props);
        this.move = this.move.bind(this);
        this.renameFile = this.renameFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.createDirectory = this.createDirectory.bind(this);
        this.upload = this.upload.bind(this);
    }

    renderField(key, value) {
        switch(key){
            case 'createdAt':
                return formatDateTime(value);
            default:
                return value;
        }
    }

    upload(files, parentId=null) {
        return this.props.createDocuments({files, parentId})
    }

    move(documentId, parentId) {
        return this.props.updateDocument(documentId, {parentId: parentId})
    }

    deleteFile(documentId) {
        return this.props.deleteResource(documentId)
    }

    renameFile(documentId, filename) {
        return this.props.updateDocument(documentId, {filename: filename});
    }

    createDirectory(parentId, name) {
        return this.props.createDocuments({parentId, newDirectory: name})
    }

    render() {
        const { files } = this.props;
        return  <div className="documents-view">

            <FileTree
                files={listToTree(files)}
                flatFiles={files}
                push={this.props.push}
                move={this.move}
                deleteFile={this.props.canUpdate && this.deleteFile}
                renameFile={this.props.canUpdate && this.renameFile}
                createDirectory={this.createDirectory}
                upload={this.upload}
                canUpdate={this.props.canUpdate} // TODO, get edit matter permission
                />

        </div>
    }
}


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
            //`ELF-${matter.id}`.toLocaleLowerCase().includes(search) ||
            matter.matterNumber.toLocaleLowerCase().includes(search) ||
            matter.matterName.toLocaleLowerCase().includes(search) ||
            matter.matterType.toLocaleLowerCase().includes(search)
        });
    }
    return data;
}

function sortData(data: EL.Matter[], column: string, sortDown: boolean) {
    const collator = new Intl.Collator(undefined, {numeric: column === 'matterNumber', sensitivity: 'base'});

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
    'actions': 'Actions'
}


const MATTER_SORTABLE = {
    'matterNumber': true,
    'matterName': true,
    'matterType': true,
    'status': true,
    'createdAt': true
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
        sortColumn: 'matterNumber',
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
                                { (matter.clients || []).map((client, i) => {
                                    return <div key={i}><Link to={`/contacts/${client.id}`}>{ fullname(client) } </Link></div>
                                }) }
                            </td>
                            <td>
                                { formatDate(matter.createdAt) }
                            </td>

                            <td>
                            <Link to={`/matters/${matter.id}`} className="btn btn-sm btn-default"><Icon iconName="eye" />View</Link>
                            {  hasPermission(this.props.user, 'edit matters')  && <Link to={`/matters/${matter.id}/edit`} className="btn btn-sm btn-warning"><Icon iconName="pencil" />Edit</Link> }

                            </td>

                        </tr>}}
                        itemsRenderer={(items, ref) => {
                            return <Table responsive>
                            <thead>
                                <tr>
                                    { ['matterNumber', 'matterName', 'matterType', 'status', 'clients', 'createdAt'].map((heading: string, index) => {
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



                    <dt>Notes</dt>
                    <dd>{ (matter.notes || []).map((note, i) => {
                        return <div key={note.id}>{ name(note.creator) } -  {note.note}</div>
                    }) } </dd>
                </dl>
            </div>
        );
    }
}

class MatterDocuments extends React.PureComponent<MatterProps> {

    render() {
        return <DocumentsView files={this.props.matter.data ? this.props.matter.data.files : []} matterId={this.props.matterId} canUpdate={this.props.canUpdate}/>
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
@MatterHOC()
export class ViewMatter extends React.PureComponent<MatterProps> {
    render() {
        return <React.Fragment>
            <MatterDetails {...this.props} />
            <MatterDocuments {...this.props} />
        </React.Fragment>
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
                {/* <DocumentList name="files" label="Documents" /> */ }

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

