import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { submit } from 'redux-form';

interface IFormModalProps {
    formName: string;
    hide: Function;
    children: any;
    dispatch: Function;
}

class FormModal extends React.PureComponent<IFormModalProps, EvolutionUsers.Stateless> {
    render() {
        return (
            <Modal show={true} onHide={this.props.hide}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-sm">Create CPDPR Record</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => this.props.dispatch(submit(this.props.formName))}>Save</Button>
                    <Button onClick={this.props.hide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default connect()(FormModal);