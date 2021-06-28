import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {Modal, ButtonToolbar, Button, Form, FormControl, ListGroup, ListGroupItem} from 'react-bootstrap';
import { closeModal } from '../../actions';
import {CheckboxField, TextArea} from '../form-fields';
import {  submit, reduxForm } from 'redux-form';
import { createResource, createNotification, confirmAction } from '../../actions';
import {OutlookSearchHOC} from "../hoc/resourceHOCs";
import Loading from "../loading";




interface MessageResultsProps {
    outlookEmails: EL.Resource<EL.MsGraphSearch>
}

function ListGroupCustom({ children }) {
    return (
        <li className="list-group-item" onClick={() => {}}>
            {children}
        </li>
    );
}

class MessageResults extends React.PureComponent<MessageResultsProps, {}> {
    render() {
        if(this.props.outlookEmails.isFetching || !this.props.outlookEmails.data) {
            return <Loading/>
        }
        const outlookEmails = this.props.outlookEmails.data;
        const total = outlookEmails.value[0].hitsContainers[0].total;
        const hits = outlookEmails.value[0].hitsContainers[0].hits || [];
        return  <div className={"outlook-results"}>
                <div className={"outlook-results-count"}>{ total  } Results Found</div>
                <ListGroup>
                    { hits.map((hit, index) => {
                        return <ListGroupCustom key={index}>
                            <CheckboxField name={hit.hitId} naked />
                            { hit.summary }
                        </ListGroupCustom>
                    })}

                </ListGroup>
            </div>
    }
}

const ConnectedMessageResults = OutlookSearchHOC({cache: false})(MessageResults);

class OutlookSearch extends React.PureComponent<{}, {query: string, messages: string[]}> {
    state = {query: '', messages: []}
    render() {
        return <form>
            <div className="search-bar">
                <FormControl type="text" value={this.state.query} placeholder="Search" onChange={(e: any) => this.setState({query: e.target.value})} />
                { this.state.query && <ConnectedMessageResults query={this.state.query} debounce={1000} /> }
            </div>
        </form>
    }
}



export const OutlookSearchForm = (reduxForm({
    form: EL.FormNames.IMPORT_FROM_OUTLOOK
})(OutlookSearch as any) as any);


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
                    <OutlookSearchForm />
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