import * as React from 'react';
import { connect } from 'react-redux';
import PanelHOC from '../hoc/panelHOC';
import Panel from 'components/panel';
import * as moment from 'moment';
import { createNotification, createResource, deleteResource, updateResource, confirmAction, showUploadModal, showDocumentModal } from '../../actions';
import { Form, ButtonToolbar, Button, Col, FormGroup, ControlLabel, Alert, FormControl, Table } from 'react-bootstrap';

import { Link } from 'react-router';
import Icon from '../icon';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';
import { reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate } from '../utils/validation';
import { push } from 'react-router-redux';
import { fullname, name, guessName, formatDate, formatDateTime } from '../utils';
import MapParamsToProps from '../hoc/mapParamsToProps';

import { hasPermission } from '../utils/permissions';
import HasPermissionHOC from '../hoc/hasPermission';
import { firstBy } from 'thenby'
import classnames from 'classnames';

import { DragSource, DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { LoadingSmall } from 'components/loading';



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
        const { item, viewDocument, renameFile, deleteFile, startRename, endRename, createDirectory, startCreateFolder, endCreateFolder } = props;
        const { isDragging, connectDragSource, connectDropTarget, isOver, canDrop } = props;
        const showingSubTree =  props.showingSubTree || (canDrop && isOver);

        if(item.deleted){
            return false;
        }

        const defaultView = () => {
            return  <span>{ !item.directory && <span onClick={() => viewDocument(item.id)} className="view">View</span> }
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
            <h3 className="panel-title">{ props.title }</h3>
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
                const props = {
                    key: item.id,
                    item: item,
                    viewDocument: this.props.viewDocument,
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
        return <Panel formattedTitle={
            <SearchForm title={this.props.title} key="search" onSearchChange={this.onSearchChange} filter={this.state.filter} expandAll={this.expandAll} collapseAll={this.collapseAll} /> } className="document-panel">
            <div className="file-tree">
                { loop(files, []) }
            </div>
            { this.props.loading && <LoadingSmall /> }
            { this.props.canUpdate && <DocumentsForm documents={{onChange: (files) => this.upload(files)}} /> }
         </Panel>
    }

}


@(connect(undefined,
 (dispatch, ownProps: any) => ({
    createNotification: (args) => dispatch(createNotification(args)),
    createDocuments: (data) => dispatch(createResource(`${ownProps.basePath}/documents`, data)),
    updateDocument: (documentId, data) => dispatch(updateResource(`${ownProps.basePath}/documents/${documentId}`, data)),
    deleteResource: (documentId) => {
        const deleteAction = deleteResource(`${ownProps.basePath}/documents/${documentId}`, {
            onSuccess: [createNotification('File deleted.')],
            onFailure: [createNotification('File deletion failed. Please try again.', true)],
        });


        return dispatch(confirmAction({
            title: 'Confirm Delete File',
            content: 'Are you sure you want to delete this file',
            acceptButtonText: 'Delete',
            declineButtonText: 'Cancel',
            onAccept: deleteAction
        }));

    },
    viewDocument: (fileId) => dispatch(showDocumentModal({fileId}))
})) as any)
export class DocumentsTree extends React.PureComponent<any> {

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
                loading={this.props.cached}
                title={this.props.title}
                files={listToTree(files)}
                flatFiles={files}
                viewDocument={this.props.viewDocument}
                move={this.move}
                deleteFile={this.props.canUpdate && this.deleteFile}
                renameFile={this.props.canUpdate && this.renameFile}
                createDirectory={this.createDirectory}
                upload={this.upload}
                canUpdate={this.props.canUpdate }
                />
        </div>
    }
}