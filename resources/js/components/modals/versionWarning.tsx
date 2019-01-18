import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';
import { closeModal } from '../../actions';

interface VersionWarningProps {
    closeModal: () => void;
}

class VersionWarning extends React.PureComponent<VersionWarningProps> {
    render() {
        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>New Version</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                   <p>A new version of Evolution Users has been deployed.</p>
                </Modal.Body>

                 <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={() => {this.props.closeModal();}}>Close</Button>
                        <Button bsStyle="danger" onClick={() => location.reload()}>Refresh</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}


const mapDispatchToProps = {
    closeModal: () => closeModal({ modalName: EL.ModalNames.VERSION_WARNING }),
};


export default connect(
                       undefined,
    mapDispatchToProps,
)(VersionWarning as any);