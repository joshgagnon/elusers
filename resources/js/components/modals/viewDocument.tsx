import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';
import { closeModal } from '../../actions';
import PDF from 'react-pdf-component';


interface ViewDocumentProps {
    closeModal: () => void;
    fileId: string;
}

class ViewDocument extends React.PureComponent<ViewDocumentProps> {
    render() {
        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>View Document</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="button-row"><a className="btn btn-primary" target="_blank" href={`/api/files/${this.props.fileId}`}>Download</a></div>
                    <div className="pdf-wrapper">
                        <PDF url={`/api/files/${this.props.fileId}/preview`} scale={2.5} noPDFMsg='Loading...' />
                    </div>
                </Modal.Body>

                 <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={() => {this.props.closeModal();}}>Close</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}


const mapDispatchToProps = {
    closeModal: () => closeModal({ modalName: EL.ModalNames.DOCUMENT}),
};


export default connect(
      (state : EL.State) => state.modals[EL.ModalNames.DOCUMENT],
    mapDispatchToProps,
)(ViewDocument as any);