import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Modal, ButtonToolbar, Button, Form } from 'react-bootstrap';
import { closeModal } from '../../actions';
import  { submit, change } from 'redux-form';
import { CreateContactFormSimple } from '../contacts';
import { createResource, createNotification } from '../../actions';


interface CreateContactProps {
    closeModal: () => void;
    name: string;
    form: string;
    submit: (form: string, name: string, data: React.FormEvent<typeof Form>) => void;
    createContact: () => void;
}

class CreateContact extends React.PureComponent<CreateContactProps> {
    render() {

        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Contact</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <CreateContactFormSimple onSubmit={(data) => this.props.submit(this.props.form, this.props.name, data)}/>
                </Modal.Body>

                 <Modal.Footer>

                        <Button onClick={() => {this.props.closeModal();}}>Close</Button>
                        <Button variant="primary" onClick={this.props.createContact}>Create</Button>

                </Modal.Footer>
            </Modal>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
  {
    closeModal: () => closeModal({ modalName: EL.ModalNames.CREATE_CONTACT }),
    createContact: () => submit(EL.FormNames.CREATE_CONTACT_FORM_SIMPLE),
    submit: (form: string, name: string, data: React.FormEvent<typeof Form>) => {
        const url = 'contacts';
        const meta: EL.Actions.Meta = {
            onSuccess: [createNotification('Contact created.'), (response) => change(form, name, response.contactId), closeModal({ modalName: EL.ModalNames.CREATE_CONTACT })],
            onFailure: [createNotification('Contact creation failed. Please try again.', true)],
            invalidateList: ['contacts']
        };
        return createResource(url, data, meta)
    }
  },
  dispatch,
)


export default connect(
    (state : EL.State) => state.modals[EL.ModalNames.CREATE_CONTACT],
    mapDispatchToProps,
)(CreateContact as any);