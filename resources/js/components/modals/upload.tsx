import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';
import { DocumentDropZone } from '../form-fields/documents';
import { closeModal, updateResource, createNotification } from '../../actions';

interface UploadProps {
    closeModal: () => void;
    updateContacts: (data: any) => void;
}

class Upload extends React.PureComponent<UploadProps> {
    state = {
        file: null
    }

    onDrop(droppedFiles) {
        this.setState({file: droppedFiles[0]})
    }

    render() {
        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Contacts List</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                { !this.state.file && <DocumentDropZone onDrop={this.onDrop.bind(this)}>
                         <div>Upload a contacts from action step</div>
                </DocumentDropZone> }

                { !!this.state.file && <div>Click Upload to update your contacts</div>}

                </Modal.Body>

                 <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={() => {this.props.closeModal();}}>Close</Button>
                        <Button bsStyle="danger" onClick={() => this.setState({file: null})} disabled={!this.state.file}>Clear</Button>
                        <Button bsStyle="primary" onClick={() => this.props.updateContacts({files: [this.state.file]})} disabled={!this.state.file}>Upload</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}


const mapDispatchToProps = {
    closeModal: () => closeModal({ modalName: EL.ModalNames.UPLOAD}),
    updateContacts: (data: any) => {
        const url = 'contacts-sync';
        const meta: EL.Actions.Meta = {
            onSuccess: [createNotification('Contacts updated.'), closeModal({ modalName: EL.ModalNames.UPLOAD })],
            onFailure: [createNotification('Contact update failed. Please try again.', true)]
        };
        return updateResource(url, data, meta)
    }
};


export default connect(
    undefined,
    mapDispatchToProps,
)(Upload as any);