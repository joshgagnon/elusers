import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';
import { closeModal } from 'actions';
import PDF from 'react-pdf-component';
import EmailViewer from 'components/email-viewer';
import Loading from 'components/loading';
import PDFJS from 'pdfjs-dist'

PDF.PDFJS.GlobalWorkerOptions.workerSrc = '/js/app.worker.js';

interface ViewDocumentProps {
    closeModal: () => void;
    document: EL.Document
}

class ViewDocument extends React.PureComponent<ViewDocumentProps> {
    render() {
        const filename = this.props.document.filename.toLowerCase();
        const pdfLike = ['.pdf', '.doc', '.docx', '.odt'].some(suf => filename.endsWith(suf));
        const image = ['.jpg', '.jpeg', '.png', '.gif', 'bmp'].some(suf => filename.endsWith(suf));
        const eml = ['.eml'].some(suf => filename.endsWith(suf));
        const msg = ['.msg'].some(suf => filename.endsWith(suf));

        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>View Document</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="button-row"><a className="btn btn-primary" target="_blank" href={`/api/files/${this.props.document.id}`}>Download</a></div>
                    <div className="pdf-wrapper">
                       { pdfLike && <PDF url={`/api/files/${this.props.document.id}/preview`} scale={2.5} noPDFMsg='Loading...' /> }
                       { image && <img style={{maxWidth: '100%'}} src={`/api/files/${this.props.document.id}`} /> }
                       { eml && <EmailViewer src={`/api/files/${this.props.document.id}`} format="eml" loading={<Loading />} /> }
                       { msg && <EmailViewer src={`/api/files/${this.props.document.id}`} format="msg" loading={<Loading />} /> }
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