import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';
import { DocumentDropZone } from '../form-fields/documents';
import { closeModal, updateResource, createNotification } from '../../actions';

interface UploadProps {
    closeModal: () => void;
    update: (data: any) => void;
    uploadType: string;
}

class Upload extends React.PureComponent<UploadProps> {
    state = {
        file: null
    }

    onDrop(droppedFiles) {
        this.setState({file: droppedFiles[0]})
    }

    render() {
        const { uploadType } = this.props;
        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload { uploadType === 'contacts' ? 'Contacts' : 'Matters' } List</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                { !this.state.file && <DocumentDropZone onDrop={this.onDrop.bind(this)}>
                         <div>Upload { uploadType === 'contacts' ? 'contacts' : 'matters' } from ActionAtep</div>
                </DocumentDropZone> }

                { !!this.state.file && <div>Click Upload to update your { uploadType === 'contacts' ? 'contacts' : 'matters' }</div>}

                </Modal.Body>

                 <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={() => {this.props.closeModal();}}>Close</Button>
                        <Button bsStyle="danger" onClick={() => this.setState({file: null})} disabled={!this.state.file}>Clear</Button>
                        <Button bsStyle="primary" onClick={() => this.props.update({uploadType, files: [this.state.file]})} disabled={!this.state.file}>Upload</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}


const mapDispatchToProps = {
    closeModal: () => closeModal({ modalName: EL.ModalNames.UPLOAD}),
    update: (data: any) => {
        const url = data.uploadType === 'contacts' ? 'contacts-sync' : 'matters-sync';
        const identifier = data.uploadType === 'contacts' ? 'Contacts' : 'Matters';
        const meta: EL.Actions.Meta = {
            onSuccess: [createNotification(`${identifier} updated.`), closeModal({ modalName: EL.ModalNames.UPLOAD })],
            onFailure: [createNotification(`${identifier} update failed. Please try again.`, true)]
        };
        return updateResource(url, data, meta)
    }
};


export default connect(
    (state : EL.State) => state.modals[EL.ModalNames.UPLOAD],
    mapDispatchToProps,
)(Upload as any);