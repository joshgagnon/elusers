import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ButtonToolbar, Button } from 'react-bootstrap';
import { closeModal } from '../../actions';

interface AMLCFTTokenProps {
    closeModal: () => void;
    contactId: number,
    token: string;
}

class AMLCFTToken extends React.PureComponent<AMLCFTTokenProps> {
    render() {
        const { protocol, host } = window.location;
        const url = `${protocol}//${host}/amlcft/${this.props.token}`;
        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Request for AML-CFT Information</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                   <p>The following url can be used to access the AML-CFT form.  Try incognito mode to preview.</p>
                   <a href={url}>{ url }</a>
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
    closeModal: () => closeModal({ modalName: EL.ModalNames.AMLCFT_TOKEN }),
};


export default connect(
    (state : EL.State) => state.modals[EL.ModalNames.AMLCFT_TOKEN],
    mapDispatchToProps,
)(AMLCFTToken as any);