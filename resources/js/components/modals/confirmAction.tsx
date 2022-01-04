import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';
import { closeModal } from '../../actions';

interface ConfirmActionProps extends EL.ConfirmActionModal {
    closeModal: () => void;
    accept: () => void;
}

class ConfirmAction extends React.PureComponent<ConfirmActionProps> {
    render() {
        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                   <p>{this.props.content}</p>
                </Modal.Body>

                 <Modal.Footer>

                        <Button onClick={this.props.closeModal} variant="secondary">{this.props.declineButtonText}</Button>
                        <Button onClick={() => {this.props.accept(); this.props.closeModal();}} variant="primary">{this.props.acceptButtonText}</Button>

                </Modal.Footer>
            </Modal>
        );
    }
}

function mapStateToProps(state: EL.State): EL.ConfirmActionModal {
    return state.modals[EL.ModalNames.CONFIRM_ACTION];
}

const mapDispatchToProps = {
    closeModal: () => closeModal({ modalName: EL.ModalNames.CONFIRM_ACTION }),
    accept: (action: any) => action
};

function mergeProps(stateProps: EL.ConfirmActionModal, dispatchProps): ConfirmActionProps {
    return {
        ...stateProps,
        ...dispatchProps,
        accept: () => Array.isArray(stateProps.onAccept) ? stateProps.onAccept.map(onAccept => dispatchProps.accept(onAccept)) : dispatchProps.accept(stateProps.onAccept)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(ConfirmAction);