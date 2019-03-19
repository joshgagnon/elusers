import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Modal, ButtonToolbar, Button, Form } from 'react-bootstrap';
import { closeModal } from '../../actions';
import  { submit, change } from 'redux-form';
import { DeadlineForm } from '../deadlines';
import { createResource, updateResource, deleteResource, createNotification, confirmAction } from '../../actions';


interface CreateDeadlineProps {
    closeModal: () => void;
    name: string;
    form: string;
    date?: string;
    deadline?: EL.Deadline;
    submit: (form: string, name: string, data: React.FormEvent<Form>, id?: number) => void;
    deleteDeadline: (deadlineId: number) => void;
    createDeadline: () => void;
}

class CreateDeadline extends React.PureComponent<CreateDeadlineProps> {
    render() {
        const isNew = !this.props.deadline;
        const initialValues = isNew ? { dueAt: this.props.date } : this.props.deadline;
        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{ isNew ? 'Create' : 'Edit' } Deadline</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <DeadlineForm onSubmit={(data) => this.props.submit(this.props.form, this.props.name, data, isNew ? null : this.props.deadline.id)} initialValues={initialValues}/>
                </Modal.Body>

                 <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={() => {this.props.closeModal()}}>Close</Button>
                        <Button bsStyle="primary" onClick={this.props.createDeadline}>{ isNew ? 'Create' : 'Update' }</Button>
                    </ButtonToolbar>
                    <ButtonToolbar>
                        { !isNew && <Button bsStyle="danger" onClick={() => this.props.deleteDeadline(this.props.deadline.id)}>Delete</Button> }
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
  {
    closeModal: () => closeModal({ modalName: EL.ModalNames.DEADLINE }),
    createDeadline: () => submit(EL.FormNames.CREATE_DEADLINE ),
    deleteDeadline: (deadlineId: number) => {        const deleteAction = deleteResource(`deadlines/${deadlineId}`, {
            onSuccess: [createNotification('Deadline deleted.'), closeModal({ modalName: EL.ModalNames.DEADLINE })],
            onFailure: [createNotification('Deadline deletion failed. Please try again.', true)],
        });

        return confirmAction({
            title: 'Confirm Delete Deadline',
            content: 'Are you sure you want to delete this deadline?',
            acceptButtonText: 'Delete',
            declineButtonText: 'Cancel',
            onAccept: deleteAction
        });
    },

    submit: (form: string, name: string, data: React.FormEvent<Form>, id?: number) => {
        if(!id) {
            const url = 'deadlines';
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Deadline created.'), (response) => change(form, name, response.deadlineId), closeModal({ modalName: EL.ModalNames.DEADLINE })],
                onFailure: [createNotification('Deadline creation failed. Please try again.', true)],
                invalidateList: ['deadlines', 'matters']
            };
            return createResource(url, data, meta)
        }
        const url = `deadlines/${id}`;
        const meta: EL.Actions.Meta = {
            onSuccess: [createNotification('Deadline updated.'), (response) => change(form, name, response.deadlineId), closeModal({ modalName: EL.ModalNames.DEADLINE })],
            onFailure: [createNotification('Deadline update failed. Please try again.', true)],
            invalidateList: ['deadlines', 'matters']
        };
        return updateResource(url, data, meta)   

    }
  },
  dispatch,
)


export default connect(
    (state : EL.State) => state.modals[EL.ModalNames.DEADLINE],
    mapDispatchToProps,
)(CreateDeadline as any);