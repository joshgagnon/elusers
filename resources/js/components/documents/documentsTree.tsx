import * as React from 'react';
import {connect} from 'react-redux';
import Card from 'components/Card';
import {
    confirmAction,
    createNotification,
    deleteResource,
    showDocumentModal,
    updateResource,
    uploadDocument,
    uploadDocumentTree
} from '../../actions';
import {Button, FormLabel, FormControl, FormGroup, InputGroup} from 'react-bootstrap';
import Icon from '../icon';
import {copyToClipboard, debounce, formatDateTime, name} from '../utils';
import {UsersHOC} from 'components/hoc/resourceHOCs';
import {firstBy} from 'thenby'
import classnames from 'classnames';

import {DragSource, DropTarget} from 'react-dnd';
import {NativeTypes} from 'react-dnd-html5-backend-filedrop';
import {LoadingSmall} from 'components/loading';

const stopPropagation = (e) => e && e.stopPropagation && e.stopPropagation();

interface DocumentSideBarProps {
    file: EL.Document;
    users?: EL.Resource<EL.User[]>
    viewDocument: (file: EL.Document) => void;
    deleteFile: (id: number | string) => void;
    renameFile: (id: number | string, value: string) => void;
    replace: (id: number | string, files: File[]) => void;
    updatePermission: (id: number | string, permission: string, value: boolean) => void;
    unselect: (any) => void;
    canUpdate: boolean;
    loading: boolean;
    permissionControls: boolean;
}


class DocumentNotes extends React.PureComponent<any> {
    el = null;
    debounceChange = null;

    constructor(props) {
        super(props);
        this.debounceChange = debounce(this.onChange.bind(this), 500);
    }

    onChange() {
        this.props.updateNote(this.props.file.id, this.el.value);
    }

    render() {
        const note = (this.props.file.notes && this.props.file.notes[0] && this.props.file.notes[0].note) || undefined;
        return <React.Fragment>
            <FormGroup>
                <FormLabel>Note:</FormLabel>
                <FormControl as="textarea"
                             defaultValue={note}
                             placeholder={'Add a note here'}
                             rows={3}
                             inputRef={ref => {
                                 this.el = ref;
                             }}
                             disabled={!this.props.canUpdate} onChange={this.debounceChange}/>
            </FormGroup>
        </React.Fragment>
    }
}

const RenderAddress = ({address = '', name = ''}) => {
    return <span><strong>{name}</strong> {address}</span>
}

class EmailFieldList extends React.PureComponent<{ file: EL.Document }> {
    render() {
        const metadata = this.props.file.metadata || {};
        return <React.Fragment>
            <dt>Subject</dt>
            <dd>{metadata.subject}</dd>
            <dt>Date</dt>
            <dd>{formatDateTime(metadata.date)}</dd>
            <dt>To</dt>
            <dd>{(metadata.to || []).map((to, index) => <RenderAddress key={index} {...to} />)}</dd>
            <dt>From</dt>
            <dd><RenderAddress {...metadata.from} /></dd>
        </React.Fragment>
    }
}

@UsersHOC()
class DocumentSideBar extends React.PureComponent<DocumentSideBarProps> {

    permissions = ['manage organisation documents'];
    state = {renaming: false, renameValue: ''}
    input = null;

    constructor(props: DocumentSideBarProps) {
        super(props);
        this.startRename = this.startRename.bind(this);
        this.submitRename = this.submitRename.bind(this);
        this.onChange = this.onChange.bind(this);
        this.replace = this.replace.bind(this);
        this.copyLink = this.copyLink.bind(this);
        this.state.renameValue = props.file ? props.file.filename : '';
    }

    startRename() {
        this.setState({renaming: true});
    }

    submitRename() {
        if (this.state.renameValue) {
            this.setState({renaming: false});
            this.props.renameFile(this.props.file.id, this.state.renameValue);
        }
    }

    onChange(e) {
        this.setState({renameValue: e.target.value});
    }

    replace(files) {
        return this.props.replace(this.props.file.id, Array.from(files).map(file => files[0].getAsFile()));
    }

    copyLink() {
        return copyToClipboard(`${window.location.origin}/api/files/${this.props.file.id}`);
    }

    listPermissions() {
        return <React.Fragment>
            <p/>
            <FormGroup>
                <FormLabel>Restrict Access to Users with Permission:</FormLabel>
                {this.permissions.map(permission => {
                    const hasPermission = (this.props.file.permissions || []).includes(permission);
                    return <div className="checkbox permission-check" key={permission}>
                        <label>
                            <input
                                type="checkbox"
                                checked={hasPermission}
                                name={permission}
                                onChange={(e: any) => this.props.updatePermission(this.props.file.id, permission, e.target.checked)}/>
                            {permission}
                        </label>
                    </div>
                })}
            </FormGroup>
        </React.Fragment>
    }

    render() {
        const {file} = this.props;
        const {viewDocument, renameFile, deleteFile, canUpdate, loading, unselect, permissionControls} = this.props;


        const creator = file.pivot &&
            file.pivot.createdByUserId &&
            this.props.users.data &&
            this.props.users.data.find(user => user.id === file.pivot.createdByUserId);

        return <div className="document-sidebar" onClick={stopPropagation}>
            <div className="document-sidebar-body">
                {loading && <LoadingSmall/>}

                <div className="filename">
                    {!this.state.renaming && <React.Fragment>
                        <span className={documentTypeClasses(file, false) + " doc-icon"}/>
                        {file.filename}
                        {canUpdate &&
                        <Icon iconName="pencil-square-o" className="actionable doc-edit" onClick={this.startRename}/>}
                    </React.Fragment>}
                    {this.state.renaming && <FormGroup>
                        <InputGroup>
                            <FormControl autoFocus type="text" placeholder={file.filename}
                                         value={this.state.renameValue} onChange={this.onChange}/>
                            <InputGroup.Button onClick={this.submitRename}>
                                <Button variant="primary" onClick={this.submitRename}>Save</Button>
                            </InputGroup.Button>
                        </InputGroup>
                    </FormGroup>}
                </div>
                <dl className="dl-horizontal">
                    <dt>Created At</dt>
                    <dd>{formatDateTime(file.createdAt)}</dd>

                    <dt>Type</dt>
                    <dd>{file.mimeType}</dd>

                    <dt>Created By</dt>
                    <dd>{creator ? name(creator) : 'N/A'}</dd>

                    {isEmail(file) && <EmailFieldList file={file}/>}
                </dl>

                <div className="row">
                    <div className="col-md-12 text-center">
                        <div className="btn-group btn-group-sm">
                            {!file.directory && <Button onClick={() => viewDocument(file)}>View</Button>}
                            {!file.directory &&
                            <a className="btn btn-primary " target="_blank" href={`/api/files/${file.id}`}>Download</a>}
                            {!file.directory && <Button variant="success" onClick={this.copyLink}>Copy Link</Button>}
                            {canUpdate && <Button variant="danger" onClick={() => deleteFile(file.id)}>Delete</Button>}
                            <Button onClick={() => unselect(null)}>Close</Button>
                        </div>
                    </div>
                </div>
                {canUpdate && permissionControls && this.listPermissions()}
                {canUpdate && !file.directory && <DocumentsForm documents={{onChange: (files) => this.replace(files)}}
                                                                dropLabel="Drag or click here to replace this file with a new version"/>}
                {<DocumentNotes {...this.props} />}

            </div>

        </div>
    }
}

const documentFileTarget = {
    drop(props, monitor) {
        props.documents.onChange(monitor.getItem().dataTransfer.items);
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
        this.props.documents.onChange(droppedFiles);
    }

    onFileDialogCancel() {
        // timeout will not recognize context of this method
        const {onFileDialogCancel} = this.props;
        const {fileInputEl} = this;
        let {isFileDialogActive} = this;
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
        const {connectDropTarget, isOver, canDrop} = this.props;
        let className = "dropzone";
        if (isOver && !canDrop) {
            className += ' reject';
        } else if (isOver && canDrop) {
            className += ' accept';
        }
        const inputAttributes = {
            type: 'file',
            style: {display: 'none'},
            multiple: true,
            ref: el => this.fileInputEl = el,
            onChange: (e) => this.onDrop(e)
        };
        return <div>
            {this.props.label && <label className="control-label">{this.props.label}</label>}

            {connectDropTarget(<div className="dropzone" onClick={() => this.open()}>
                {this.props.dropLabel ||
                <div>Drop files here to upload or <a className="vanity-link">click to browse</a> your device</div>}
                <input {...inputAttributes} />
            </div>)}
        </div>
    }
}


export const DocumentsForm = (DropTarget(NativeTypes.FILE, documentFileTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
})) as any)(DocumentFormBase);


const isEmail = (doc) => {
    const extensions = [
        '.msg',
        '.eml'
    ]
    return extensions.some(ext => doc.filename.endsWith(ext));
}

const documentTypeClasses = (doc, showingSubTree) => {
    const map = {
        'Directory': 'fa fa-folder-o',
        'image/png': 'fa fa-file-image-o',
        'image/jpeg': 'fa fa-file-image-o',
        'application/pdf': 'fa fa-file-pdf-o',
        'application/msword': 'fa fa-file-word-o',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa fa-file-word-o',
        'application/gzip': 'fa-file-archive-o',
        'application/zip': 'fa-file-archive-o'
    };

    if (doc.directory) {
        if (!doc.protected && !(doc.permissions || []).length) {
            if (showingSubTree) {
                return 'fa fa-folder-open-o'
            }
            return 'fa fa-folder-o'
        }
        if (showingSubTree) {
            return 'fa fa-folder-open'
        }
        return 'fa fa-folder';
    }

    if (isEmail(doc)) {
        return 'fa fa-envelope-o';
    }
    return map[doc.mimeType] || 'fa fa-file-text';
}

const documentDescriptor = (doc) => {
    if (isEmail(doc) && doc.metadata && Object.keys(doc.metadata).length) {
        try {
            return <span>{[ doc.metadata.subject,
                `${formatDateTime(doc.metadata.date)}`,
                `From: ${doc.metadata.from.name || doc.metadata.from.address}`,
                `To: ${doc.metadata.to.map(to => to.name || to.address)}`].join(' - ')}
                </span>;
        } catch (e) {
        }
    }
    return doc.filename;
}

function listToTree(documents: EL.Document[] = []) {
    const roots = [];
    const map = documents.reduce((acc, d) => {
        acc[d.id] = {...d, children: []};
        return acc;
    }, {});
    documents.map(d => {
        if (!d.parentId) {
            roots.push(map[d.id]);
        } else if (map[d.parentId]) {
            map[d.parentId].children.push(map[d.id]);
            map[d.parentId].hasChildren = true;
        } else {
            //for now, ignore things in subtrees
        }
    });
    return [{
        id: 'root',
        root: true,
        directory: true,
        protected: true,
        filename: 'Documents',
        children: roots
    }]
}

function filterTree(value, tree, max = 10e4) {
    if (!value) {
        return {tree, limited: false}
    }
    let count = 0;

    function filter(value, tree) {
        return tree.map(node => {
            if (count > max) {
                return false;
            }
            const children = filter(value, node.children);
            const newNode = {...node, children};
            let found = !!children.length;
            count += children.length;
            if (node.filename.toLocaleLowerCase().indexOf(value) > -1) {
                found = true;
            }
            return found && newNode;
        }).filter(f => f)
    }

    const newTree = filter(value, tree);
    return {tree: newTree, limited: count > max};
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

        // let items = await getAllFileEntries(e.dataTransfer.items);
        if (!dragItem.id && dragItem.dataTransfer) {
            if (!monitor.didDrop()) {
                props.showSubTree(newParentid);
                props.path.map(id => props.showSubTree(id))
                props.upload(dragItem.dataTransfer.items, newParentid);
                return;
            }
        }


        if (!dragItem.id && dragItem.files) {
            if (!monitor.didDrop()) {
                props.showSubTree(newParentid);
                props.path.map(id => props.showSubTree(id))
                props.upload(dragItem.files, newParentid);
                return;
            }
        }
        if (newParentid === dragItem.id) {
            return;
        }
        if (dragItem.parentId === newParentid) {
            return;
        }
        ;
        if (props.path.indexOf(dragItem.id) > -1) {
            return;
        }
        if (!monitor.didDrop()) {
            props.showSubTree(newParentid);
            props.path.map(id => props.showSubTree(id))
            props.move(dragItem.id, newParentid);
            // always show parents on drop, so we can select result when upload finished
        }
    },
    canDrop(props, monitor) {
        return true;
    }


}


const FileSpan = (props) => {
    const {selected, canDrop, isOver, item, select, showingSubTree} = props;
    return <span className={classnames('file', {selected, 'can-drop': canDrop && isOver})}
                 onClick={(e) => {
                     e.stopPropagation();
                     !selected && select()
                 }
                 }>
        <span className={'icon ' + documentTypeClasses(item, showingSubTree)}/>
        <span className="filename">{documentDescriptor(item)}</span>
        {!!item.children && !!item.children.length &&
        <i>({item.children.length} {item.children.length > 0 ? 'Files' : 'File'})</i>}
        </span>
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
        const {selected, select, item, viewDocument, renameFile, deleteFile, startRename, endRename, createDirectory, startCreateFolder, endCreateFolder} = props;
        const {isDragging, connectDragSource, connectDropTarget, isOver, canDrop} = props;
        const showingSubTree = props.showingSubTree || (canDrop && isOver);

        if (item.deleted) {
            return false;
        }

        const submitCreateFolder = (e) => {
            e.stopPropagation && e.stopPropagation();
            const value = this.input.value;
            if (value) {
                createDirectory(item.id === 'root' ? null : item.id, value);
                endCreateFolder();
            }
        }

        const showNew = () => {
            return <div className="file-sub-tree"><span className="expand-control"></span>
                <span className="file" onClick={startCreateFolder}>
                        <span className="icon fa fa-plus-circle"></span>
                        <span className="filename"><em>Create New Folder</em></span>
                    </span>
            </div>
        }

        const showNewForm = () => {
            return <div className="file-sub-tree"><span className="expand-control"></span>
                <span className="file selected">
                        <span className="icon fa fa-plus-circle"></span>
                        <FormGroup><FormControl autoFocus type="text" onClick={e => e.stopPropagation()}
                                                placeholder={'New Folder'} inputRef={ref => {
                            this.input = ref;
                        }}/></FormGroup>
                        <span onClick={submitCreateFolder} className="view">Create Folder</span>
                        <span onClick={endCreateFolder} className="view">Cancel</span>
                    </span>
            </div>
        }

        const fileProps = {
            selected,
            canDrop,
            isOver,
            item,
            select,
            showingSubTree
        }


        const canCreateDirectory = this.props.canUpdate;

        const renderedFile = (<div className="file-sub-tree">
              <span className="expand-control">
                {(item.directory || item.hasChildren) && showingSubTree && <span className="fa fa-minus-square-o" onClick={(e) => {
                    e.stopPropagation && e.stopPropagation();
                    props.hideSubTree()
                }}/>}
                  {(item.directory || item.hasChildren) && !showingSubTree && <span className="fa fa-plus-square-o" onClick={(e) => {
                      e.stopPropagation && e.stopPropagation();
                      props.showSubTree()
                  }}/>}
              </span>
            {item.id !== "root" && !item.protected && !this.props.renaming ? connectDragSource(
                <span><FileSpan {...fileProps} /></span>) : <FileSpan  {...fileProps} />}
            {item.directory &&
            <div className={classnames("children", {"showing": showingSubTree})}>
                {canCreateDirectory && !this.props.creatingFolder && showNew()}
                {canCreateDirectory && this.props.creatingFolder && showNewForm()}
                {props.children}
            </div> }

            {!item.directory  && item.hasChildren &&
            <div className={classnames("children", {"showing": showingSubTree})}>
                {props.children}
            </div> }

        </div>)

        if (item.id === "root") {
            return <React.Fragment>
                {canCreateDirectory && !this.props.creatingFolder && showNew()}
                {canCreateDirectory && this.props.creatingFolder && showNewForm()}
                {props.children}
            </React.Fragment>
        }
        return connectDropTarget(renderedFile);
    }
}

const SearchForm = (props) => {
    return <div>
        <h3 className="card-title">{props.title}</h3>
        <form className="form-inline pull-right">
            <FormGroup><FormControl type="text" onChange={props.onSearchChange} placeholder="Search"
                                    value={props.filter}/></FormGroup>
            <div className="btn-group">
                <Button onClick={props.expandAll}>Expand All</Button>
                <Button onClick={props.collapseAll}>Collapse All</Button>
                { props.importFromOutlook && <Button variant={'info'} onClick={props.importFromOutlook}>Import From Outlook</Button> }
            </div>
        </form>
    </div>
}


const EMPTY_ARRAY = [];
const ACCEPT_DROP_TYPES = [FILE, NativeTypes.FILE];

class FileTree extends React.PureComponent<any> {
    state = {root: true, filter: '', creatingFolder: false, renaming: false, selected: false}
    static MAX_FILTERED = 500;

    constructor(props) {
        super(props);
        this.expandAll = this.expandAll.bind(this);
        this.collapseAll = this.collapseAll.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.upload = this.upload.bind(this);
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

    upload(files, parentId = null) {
        if (!parentId) {
            const target = this.state.selected && this.props.flatFiles.find(f => f.id === this.state.selected);
            if (target && target.userUploaded) {
                parentId = target.directory ? target.id : target.parentId;
                parentId = parentId === 'root' ? null : parentId;
            }
        }
        parentId && this.showSubTree(parentId)
        this.props.upload(files, parentId)
    }

    render() {
        const getProps = (item, path) => {
            return {
                key: item.id,
                item: item,
                file: item,
                viewDocument: this.props.viewDocument,
                accepts: item.directory ? ACCEPT_DROP_TYPES : EMPTY_ARRAY,
                fileTypes: FILE,
                select: () => this.select(item.id),
                unselect: () => this.select(null),
                selected: !this.state.creatingFolder && this.state.selected === item.id,
                renaming: !this.state.creatingFolder && this.state.selected === item.id && this.state.renaming === item.id,
                showingSubTree: this.state[item.id] || !!this.state.filter,
                showSubTree: (id) => this.showSubTree(id || item.id),
                hideSubTree: (id) => this.hideSubTree(id || item.id),
                move: this.props.move,
                startRename: () => this.startRename(item.id),
                endRename: () => this.endRename(),
                renameFile: this.props.renameFile,
                deleteFile: this.props.deleteFile,
                updatePermission: this.props.updatePermission,
                creatingFolder: this.state.creatingFolder === item.id,
                startCreateFolder: (e) => {
                    stopPropagation(e);
                    this.startCreateFolder(item.id);
                },
                endCreateFolder: (e) => {
                    stopPropagation(e);
                    this.endCreateFolder();
                },
                createDirectory: this.props.createDirectory,
                upload: this.upload,
                replace: this.props.replace,
                path: path,
                canUpdate: this.props.canUpdate,
                permissionControls: this.props.permissionControls,
                updateNote: this.props.updateNote,
                loading: this.props.loading
            }
        }
        const loop = (data, path) => {
            return data.map((item) => {
                const props = getProps(item, path);
                if (item.children && item.children.length) {

                    const newPath = [...path, item.id];

                    item.children
                        .sort(firstBy((doc: EL.Document) => {
                            return doc.directory ? -1 : 1
                        })
                            .thenBy((v: EL.Document) => v.metadata && v.metadata.date && new Date(v.metadata.date))
                            .thenBy('filename', {ignoreCase: true})
                            .thenBy('id'));

                    return <RenderFile  {...props}>
                        {props.showingSubTree && loop(item.children, newPath)}
                    </RenderFile>
                }
                return <RenderFile {...props} />;
            });
        };

        const {tree, limited} = filterTree(this.state.filter, this.props.files, FileTree.MAX_FILTERED);

        const selectedFile = this.props.flatFiles.find(file => file.id === this.state.selected);
        return <div onClick={() => this.select(null)}>
            <Card formattedTitle={
                <SearchForm
                        importFromOutlook={this.props.importFromOutlook}
                        title={this.props.title} key="search" onSearchChange={this.onSearchChange}
                        filter={this.state.filter} expandAll={this.expandAll} collapseAll={this.collapseAll}/>}
                   className="document-Card">
                <div className="file-tree">
                    {tree.length === 0 && <span>No files found.</span>}
                    {limited && <span>Results limited to first {FileTree.MAX_FILTERED}</span>}
                    {loop(tree, [])}

                </div>
                {this.props.loading && <LoadingSmall/>}
                {this.props.canUpdate && <DocumentsForm documents={{onChange: (files) => this.upload(files)}}/>}
                {this.state.selected && selectedFile && <DocumentSideBar {...getProps(selectedFile, null)} />}
            </Card>
        </div>
    }

}


@(connect(undefined,
    (dispatch, ownProps: any) => ({
        createNotification: (args) => dispatch(createNotification(args)),
        createDocuments: (data) => dispatch(uploadDocument({url: `${ownProps.basePath}/documents`, ...data})),
        createDocumentTree: (data) => dispatch(uploadDocumentTree({url: `${ownProps.basePath}/documents`, ...data})),
        updateDocument: (documentId, data) => dispatch(updateResource(`${ownProps.basePath}/documents/${documentId}`, data)),
        replaceDocument: (documentId, data) => dispatch(updateResource(`files/${documentId}/replace`, data)),
        updatePermission: (documentId, data) => dispatch(updateResource(`files/${documentId}/permission`, data)),
        updateNote: (documentId, data) => dispatch(updateResource(`files/${documentId}/note`, data)),
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
        viewDocument: (file) => dispatch(showDocumentModal({document: file}))
    })) as any)
export class DocumentsTree extends React.PureComponent<any> {
    state = {tree: []}
    constructor(props) {
        super(props);
        this.move = this.move.bind(this);
        this.renameFile = this.renameFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.createDirectory = this.createDirectory.bind(this);
        this.updatePermission = this.updatePermission.bind(this);
        this.upload = this.upload.bind(this);
        this.replace = this.replace.bind(this);
        this.updateNote = this.updateNote.bind(this);
        this.state.tree = listToTree(props.files)
    }

    componentDidUpdate(prevProps) {
        if(prevProps.files !== this.props.files) {
            this.setState({tree: listToTree(this.props.files)})
        }
    }

    renderField(key, value) {
        switch (key) {
            case 'createdAt':
                return formatDateTime(value);
            default:
                return value;
        }
    }

    upload(files, parentId = null) {
        if (files instanceof DataTransferItemList) {
            return this.props.createDocumentTree({fileTree: files, parentId});
        }
        return this.props.createDocuments({files, parentId})
    }

    replace(documentId, files) {
        // Better make sure only one is going
        return this.props.replaceDocument(documentId, {files: [files[0]]})
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

    updatePermission(documentId, permission, value) {
        return this.props.updatePermission(documentId, {permission: {[permission]: value}});
    }

    updateNote(documentId, text) {
        return this.props.updateNote(documentId, {note: text});
    }

    render() {
        const {files} = this.props;
        return <div className="documents-view">
            <FileTree
                loading={this.props.cached || this.props.loading}
                title={this.props.title}
                files={this.state.tree}
                flatFiles={files}
                viewDocument={this.props.viewDocument}
                move={this.move}
                deleteFile={this.props.canUpdate && this.deleteFile}
                renameFile={this.props.canUpdate && this.renameFile}
                updatePermission={this.props.canUpdate && this.updatePermission}
                createDirectory={this.createDirectory}
                upload={this.upload}
                replace={this.replace}
                canUpdate={this.props.canUpdate}
                permissionControls={this.props.permissionControls}
                updateNote={this.updateNote}
                importFromOutlook={this.props.importFromOutlook}
            />
        </div>
    }
}
