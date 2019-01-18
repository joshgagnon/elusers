import * as React from 'react';
import { connect } from 'react-redux';
import PanelHOC from '../hoc/panelHOC';
import { OrganisationDocumentsHOC, ContactDocumentsHOC, MatterDocumentsHOC } from '../hoc/resourceHOCs';
import * as moment from 'moment';
import { DocumentDropZone } from '../form-fields/documents';
import { createNotification, createResource, deleteResource, confirmAction } from '../../actions';
import { Form, ButtonToolbar, Button, Tabs, Tab, FormControl } from 'react-bootstrap';
import { fullname, name } from '../utils';
import { Link } from 'react-router';
import { DocumentsTree } from 'components/documents/documentsTree';
import { hasPermission } from '../utils/permissions';


/*

interface  DocumentsProps {
      documents: EL.Resource<EL.OrganisationDocument[]>;
    //delete: (documentId: number) => void;
}
interface  DocumentsViewProps {
    searchValue: string;
    documents: EL.OrganisationDocument[];
    upload: (files: any) => any;
    destroy: (documentId: string) => any;
}


type Doc = EL.OrganisationDocument | EL.ContactDocument | EL.MatterDocument;
function filterData(search: string, data: Doc[], includes : (string, any) => boolean = (any) => false) : Doc[]{
    if(search){
        search = search.toLocaleLowerCase();
        return data.filter((orgFile: Doc) => orgFile.file.filename.toLowerCase().includes(search) || includes(search, orgFile));
    }
    data.sort((a, b) => a.file.filename.localeCompare(b.file.filename));
    return data;
}



class OrgDocumentsView extends React.PureComponent<DocumentsViewProps> {
    constructor(props: DocumentsViewProps) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    }
    onDrop(droppedFiles) {
        this.props.upload(droppedFiles);
    }
    render() {
        const data = filterData(this.props.searchValue, this.props.documents);
        return (
            <div>
                <br/>
                <DocumentDropZone onDrop={this.onDrop}>
                    <div className="text-center">Click or drag files to upload.  Files will be encrypted and available organisation wide.</div>
                </DocumentDropZone>
                <table className="table">
                <thead>
                    <tr>
                    <th>Filename</th>
                    <th>Created At</th>
                    <th>Uploaded By</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                     {data.map((document: EL.OrganisationDocument, index: number) => {
                        return <tr key={index}>
                        <td>{document.file.filename}</td>
                        <td>{document.file.createdAt}</td>
                        <td>{ document.creator && name(document.creator) }</td>
                        <td>
                        <a target="_blank" className="btn btn-default btn-sm" href={`/api/files/${document.file.id}`}>Download</a>
                        <Button bsSize='small' bsStyle="danger" onClick={() => this.props.destroy(document.id as string)}>Delete</Button></td>

                        </tr>
                    })}
                </tbody>

                </table>
            </div>
        );
    }
}

interface  ContactDocumentsViewProps {
    searchValue: string;
    documents?: EL.Resource<EL.ContactDocument[]>;
}
@ContactDocumentsHOC()
class ContactDocumentsView extends React.PureComponent<ContactDocumentsViewProps> {

    render() {
        const data = filterData(this.props.searchValue, (this.props.documents.data || []),
                                (search: string, doc: EL.ContactDocument) => fullname(doc.contact).toLowerCase().includes(search));
        return (
            <div>
                <table className="table">
                <thead>
                    <tr>
                    <th>Filename</th>
                    <th>Created At</th>
                    <th>Contact</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                     {data.map((document: EL.ContactDocument, index: number) => {
                        return <tr key={index}>
                        <td>{document.file.filename}</td>
                        <td>{document.file.createdAt}</td>
                        <td><Link to={`/contacts/${document.contact.id}`}> { fullname(document.contact) }</Link></td>
                        <td>
                        <a target="_blank" className="btn btn-default btn-sm" href={`/api/files/${document.file.id}`}>Download</a>
                        </td>
                        </tr>
                    })}
                </tbody>

                </table>
            </div>
        );
    }
}

interface  MatterDocumentsViewProps {
    searchValue: string;
    documents?: EL.Resource<EL.MatterDocument[]>;
}
@MatterDocumentsHOC()
class MatterDocumentsView extends React.PureComponent<MatterDocumentsViewProps> {

    render() {
        const data = filterData(this.props.searchValue, (this.props.documents.data || []),
                                (search: string, doc: EL.MatterDocument) => `${doc.matter.matterNumber} ${doc.matter.matterName}`.toLowerCase().includes(search));
        return (
            <div>
                <table className="table">
                <thead>
                    <tr>
                    <th>Filename</th>
                    <th>Created At</th>
                    <th>Matter</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                     {data.map((document: EL.MatterDocument, index: number) => {
                        return <tr key={index}>
                        <td>{document.file.filename}</td>
                        <td>{document.file.createdAt}</td>
                         <td><Link to={`/contacts/${document.matter.id}`}> { document.matter.matterNumber }</Link></td>
                        <td>
                        <a target="_blank" className="btn btn-default btn-sm" href={`/api/files/${document.file.id}`}>Download</a>
                        </td>
                        </tr>
                    })}
                </tbody>

                </table>
            </div>
        );
    }
}


const ConnectedOrgDocumentsView = connect<void, {upload: (files: any) => void; destroy: (fileId: string) => void}, {documents: EL.Document[]} >(
    undefined,
    {
        upload: (files: any) => {
            const url = `organisation-files`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Document Uploaded.')],
                onFailure: [createNotification('Document uploaded failed. Please try again.', true)],
            };
            return createResource(url, { files }, meta);
        },
        destroy: (documentId: string) => {
            const deleteAction = deleteResource(`organisation-files/${documentId}`, {
                onSuccess: [createNotification('Document deleted.')],
                onFailure: [createNotification('Document  deletion failed. Please try again.', true)],
            });
            return confirmAction({
                title: 'Confirm Delete Document',
                content: 'Are you sure you want to delete this document?',
                acceptButtonText: 'Delete',
                declineButtonText: 'Cancel',
                onAccept: deleteAction
          })
        }
    }
)(OrgDocumentsView);


@OrganisationDocumentsHOC()
@PanelHOC<DocumentsProps, {searchValue: string}>('Documents', props => [props.documents])
export default  class Documents extends React.PureComponent<DocumentsProps> {
    state = {
        searchValue: ''
    }
    render() {
        return <React.Fragment>
                <div className="search-bar">
                    <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={(e: any) => this.setState({searchValue: e.target.value})} />
                </div>

           <Tabs defaultActiveKey={1} id="documents">
              <Tab eventKey={1} title="Organisation Documents">
                <ConnectedOrgDocumentsView documents={this.props.documents.data} searchValue={this.state.searchValue}/>
              </Tab>
              <Tab eventKey={2} title="Contact Documents">
                  <ContactDocumentsView searchValue={this.state.searchValue} />
              </Tab>
              <Tab eventKey={3} title="Matter Documents">
                  <MatterDocumentsView searchValue={this.state.searchValue} />
              </Tab>
             </Tabs>

        </React.Fragment>
    }
    */

interface  DocumentsProps {
      documents: EL.Resource<EL.OrganisationDocument[]>;
      canUpdate: boolean;
    //delete: (documentId: number) => void;
}

@(connect((state: EL.State) => ({
    canUpdate: hasPermission(state.user, 'manage organisation documents')
})) as any)
@OrganisationDocumentsHOC({cache: true})
export default  class Documents extends React.PureComponent<DocumentsProps> {

    render() {
        return <DocumentsTree
            title="Organisation Documents"
            files={this.props.documents.data ? this.props.documents.data : []}
            basePath={`organisation-files`}
            cached={this.props.documents.cached}
            canUpdate={this.props.canUpdate} />
    }
}