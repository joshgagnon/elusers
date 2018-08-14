import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';
import { DocumentDropZone } from '../form-fields/documents';
import { closeModal } from '../../actions';

interface UploadProps {
    closeModal: () => void;
}

class Upload extends React.PureComponent<UploadProps> {
    render() {
        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Contacts List</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                <DocumentDropZone onDrop={this.onDrop}>
                         <div>Upload a contacts from action step</div>
                    </DocumentDropZone>


                </Modal.Body>

                 <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={() => {this.props.closeModal();}}>Close</Button>
                        <Button bsStyle="primary">Upload</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}


const mapDispatchToProps = {
    closeModal: () => closeModal({ modalName: EL.ModalNames.UPLOAD}),
};


export default connect(
    undefined,
    mapDispatchToProps,
)(Upload as any);