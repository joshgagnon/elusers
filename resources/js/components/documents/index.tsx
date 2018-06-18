import * as React from 'react';
import { connect } from 'react-redux';
import PanelHOC from '../hoc/panelHOC';
import { OrganisationDocumentsHOC } from '../hoc/resourceHOCs';
import * as moment from 'moment';
import { DocumentDropZone } from '../form-fields/documents';
import { createNotification, createResource, deleteResource, confirmAction } from '../../actions';
import { Form, ButtonToolbar, Button } from 'react-bootstrap';


interface  DocumentsProps {
      documents: EL.Resource<EL.Document[]>;
    //delete: (documentId: number) => void;
}
interface  DocumentsViewProps {
      documents: EL.Document[];
    upload: (files: any) => any;
    destroy: (documentId: string) => any;
}


class DocumentsView extends React.PureComponent<DocumentsViewProps> {
    constructor(props: DocumentsViewProps) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    }
    onDrop(droppedFiles) {
        this.props.upload(droppedFiles);
    }
    render() {
        return (
            <div>
                <DocumentDropZone onDrop={this.onDrop}>
                    <div>Click or drag files to upload.  Files will be encrypted and available organisation wide.</div>
                </DocumentDropZone>
                <p/>
                <table className="table">
                <thead>
                    <tr>
                    <th>Filename</th>
                    <th>Created At</th><th></th><th></th>
                    </tr>
                </thead>
                <tbody>
                    { this.props.documents.map((document: EL.Document, index: number) => {
                        return <tr key={index}>
                        <td>{document.filename}</td>
                        <td>{document.createdAt}</td>
                        <td><a target="_blank" className="btn btn-default btn-sml" href={`/api/files/${document.id}`}>Download</a></td>
                        <td><Button bsSize='small' bsStyle="danger" onClick={() => this.props.destroy(document.id as string)}>Delete</Button></td>

                        </tr>
                    })}
                </tbody>

                </table>
            </div>
        );
    }
}


const ConnectedDocumentsView = connect<void, {upload: (files: any) => void; destroy: (fileId: string) => void}, {documents: EL.Document[]} >(
    undefined,
    {
        upload: (files: any) => {
            const url = `organisation_files`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Document Uploaded.')],
                onFailure: [createNotification('Document uploaded failed. Please try again.', true)],
            };
            return createResource(url, { files }, meta);
        },
        destroy: (documentId: string) => {
            const deleteAction = deleteResource(`organisation_files/${documentId}`, {
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
)(DocumentsView);


@OrganisationDocumentsHOC()
@PanelHOC<DocumentsProps>('Documents', props => [props.documents])
export default  class Documents extends React.PureComponent<DocumentsProps> {

    render() {
        return (
                <ConnectedDocumentsView documents={this.props.documents.data}/>

        );
    }
}