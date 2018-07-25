import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';
import { closeModal } from '../../actions';

interface CreateContactProps {
    closeModal: () => void;
    name: string;
}

class CreateContact extends React.PureComponent<CreateContactProps> {
    render() {

        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Request for AML-CFT Information</Modal.Title>
                </Modal.Header>

                <Modal.Body>

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
    closeModal: () => closeModal({ modalName: EL.ModalNames.CREATE_CONTACT }),
};


export default connect(
    (state : EL.State) => state.modals[EL.ModalNames.CREATE_CONTACT],
    mapDispatchToProps,
)(CreateContact as any);