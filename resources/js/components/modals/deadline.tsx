import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Modal, ButtonToolbar, Button, Form } from 'react-bootstrap';
import { closeModal } from '../../actions';
import  { submit, change } from 'redux-form';
import { DeadlineForm } from '../deadlines';
import { createResource, createNotification } from '../../actions';


interface CreateDeadlineProps {
    closeModal: () => void;
    name: string;
    form: string;
    submit: (form: string, name: string, data: React.FormEvent<Form>) => void;
    createDeadline: () => void;
}

class CreateDeadline extends React.PureComponent<CreateDeadlineProps> {
    render() {

        return (
            <Modal backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Deadline</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <DeadlineForm onSubmit={(data) => this.props.submit(this.props.form, this.props.name, data)}/>
                </Modal.Body>

                 <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={() => {this.props.closeModal();}}>Close</Button>
                        <Button bsStyle="primary" onClick={this.props.createDeadline}>Create</Button>
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
    submit: (form: string, name: string, data: React.FormEvent<Form>) => {
        const url = 'deadlines';
        const meta: EL.Actions.Meta = {
            onSuccess: [createNotification('Deadline created.'), (response) => change(form, name, response.deadlineId), closeModal({ modalName: EL.ModalNames.DEADLINE })],
            onFailure: [createNotification('Deadline creation failed. Please try again.', true)],
            invalidateList: ['deadlines']
        };
        return createResource(url, data, meta)
    }
  },
  dispatch,
)


export default connect(
    (state : EL.State) => state.modals[EL.ModalNames.DEADLINE],
    mapDispatchToProps,
)(CreateDeadline as any);