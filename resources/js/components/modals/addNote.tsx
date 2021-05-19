import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Modal, ButtonToolbar, Button, Form } from 'react-bootstrap';
import { closeModal } from '../../actions';
import { TextArea } from '../form-fields';
import {  submit, reduxForm } from 'redux-form';
import { createResource, createNotification, confirmAction } from '../../actions';


const AddNote = () => <TextArea name={`note`}  naked required />



export const AddNoteForm = (reduxForm({
    form: EL.FormNames.ADD_NOTE
})(AddNote as any) as any);


interface addNoteProps {
    closeModal: () => void;
    id: string;
    type: string;
    submit: (form: string, name: string, data: React.FormEvent<Form>, id?: number) => void;
    addNote: () => void;
}

class AddNoteModal extends React.PureComponent<addNoteProps> {
    render() {
        const { id, type } = this.props;
        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{ type === 'contact' ? 'Add Note to Contact' : 'Add Note to Matter'}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <AddNoteForm onSubmit={(data) => this.props.submit(id, type, data)} />
                </Modal.Body>

                <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={() => {this.props.closeModal()}}>Close</Button>
                        <Button bsStyle="primary" onClick={this.props.addNote}>{'Add Note'}</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
    {
        closeModal: () => closeModal({ modalName: EL.ModalNames.ADD_NOTE}),
        addNote: () => submit(EL.FormNames.ADD_NOTE),

        submit: (id: string, type: string, data: React.FormEvent<Form>) => {
            const url = `${type}s/${id}/notes`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Note added.'), closeModal({ modalName: EL.ModalNames.ADD_NOTE })],
                onFailure: [createNotification('Failed to add note.', true)],
                invalidateList: [`${type}s/${id}`]
            };
            return createResource(url, data, meta)

        }
    },
    dispatch,
)


export default connect(
    (state : EL.State) => state.modals[EL.ModalNames.ADD_NOTE],
    mapDispatchToProps,
)(AddNoteModal as any);