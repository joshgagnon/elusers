import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {Modal, ButtonToolbar, Button, Form, FormControl} from 'react-bootstrap';
import { closeModal } from '../../actions';
import { TextArea } from '../form-fields';
import {  submit, reduxForm } from 'redux-form';
import { createResource, createNotification, confirmAction } from '../../actions';
import {OutlookSearchHOC} from "../hoc/resourceHOCs";


const importFromOutlook = () => <TextArea name={`note`}  naked required />



export const importFromOutlookForm = (reduxForm({
    form: EL.FormNames.IMPORT_FROM_OUTLOOK
})(importFromOutlook as any) as any);



class MessageResults extends React.PureComponent<{}, {}> {
    render() {
        return <div>

        </div>
    }
}

const ConnectedMessageResults = OutlookSearchHOC({cache: true})(MessageResults);

class OutlookSearch extends React.PureComponent<{}, {query: string, messages: string[]}> {
    state = {query: '', messages: []}
    render() {
        return <form>
            <div className="search-bar">
                <FormControl type="text" value={this.state.query} placeholder="Search" onChange={(e: any) => this.setState({query: e.target.value})} />
                <ConnectedMessageResults query={this.state.query} debounce={1000} />
            </div>
        </form>
    }
}

interface importFromOutlookProps {
    closeModal: () => void;
    matterId?: string;
    contactId?: string;
    type: string;
    submit: (form: string, name: string, data: React.FormEvent<Form>, id?: number) => void;
    importFromOutlook: () => void;
}

class importFromOutlookModal extends React.PureComponent<importFromOutlookProps> {
    render() {
        const { matterId, contactId, type } = this.props;
        return (
            <Modal bsSize="large" backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{ type === 'contact' ? 'Import Messages' : 'Import Messages'}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <OutlookSearch />
                </Modal.Body>

                <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={() => {this.props.closeModal()}}>Close</Button>
                        <Button bsStyle="primary" onClick={this.props.importFromOutlook}>{'Import Messages'}</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
    {
        closeModal: () => closeModal({ modalName: EL.ModalNames.IMPORT_FROM_OUTLOOK}),
        importFromOutlook: () => submit(EL.FormNames.IMPORT_FROM_OUTLOOK),

        submit: (id: string, type: string, data: React.FormEvent<Form>) => {
            const url = `${type}s/${id}/notes`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Note added.'), closeModal({ modalName: EL.ModalNames.IMPORT_FROM_OUTLOOK })],
                onFailure: [createNotification('Failed to add note.', true)],
                invalidateList: [`${type}s/${id}`]
            };
            return createResource(url, data, meta)

        }
    },
    dispatch,
)


export default connect(
    (state : EL.State) => state.modals[EL.ModalNames.IMPORT_FROM_OUTLOOK],
    mapDispatchToProps,
)(importFromOutlookModal as any);