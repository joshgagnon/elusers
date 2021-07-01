import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {
    Modal,
    ButtonToolbar,
    Button,
    Form,
    FormControl,
    ListGroup,
    ListGroupItem,
    TabContainer,
    Tab, Tabs
} from 'react-bootstrap';
import {closeModal, updateView} from '../../actions';
import {CheckboxField, TextArea} from '../form-fields';
import { createResource, createNotification, confirmAction } from '../../actions';
import {OutlookSearchHOC} from "../hoc/resourceHOCs";
import Loading from "../loading";
import {PureComponent} from "react";

interface MessageControlsProps {
    addMessage: (hit: EL.MsGraphHit) => void;
    removeMessage: (hitId: string) => void;
    hitIds: {[key: string]: true}
}


interface MessageResultsProps extends MessageControlsProps {
    outlookEmails: EL.Resource<EL.MsGraphSearch>;
}

function ListGroupCustom({ included, children }) {
    return (
        <li className={"list-group-item "+(included ? ' list-group-item-success' : '')} onClick={() => {}}>
            {children}
        </li>
    );
}

interface RecipientProps {
    recipient: EL.MsGraphMailRecipient
};


const OutlookItem = ({included, hit, addMessage, removeMessage}) => {
    return <ListGroupCustom included={included}>
        <div className="summary-block">
            <span className={"from"}>From: <Recipient recipient={hit.resource.from} /></span>
            <span className={"to"}>To: { (hit.resource.toRecipients || hit.resource.replyTo).map((r, i) => <Recipient key={i} recipient={r}/>) }</span>
            <span className={"subject"}>{ hit.resource.subject }</span>
            <span className={"summary"} dangerouslySetInnerHTML={{__html: hit.summary }} />
            <a className="outlook-link" target={"_blank"} href={hit.resource.webLink}>View in Outlook</a>
        </div>
        <div className={"controls"}>
            {!included && <Button onClick={() => addMessage(hit)}>Add</Button>}
            {included && <Button onClick={() => removeMessage(hit.hitId)}>Remove</Button>}
</div>
</ListGroupCustom>
}

const Recipient = (props)  => {
if(props.recipient.emailAddress.name && (props.recipient.emailAddress.address || '').includes('@)') ) {
return <span>{ props.recipient.emailAddress.name } &lt;{ props.recipient.emailAddress.address}&gt;</span>
    }
    return props.recipient.emailAddress.name;
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
                        const included = this.props.hitIds[hit.hitId];
                        return <OutlookItem key={index}  included={included} hit={hit} addMessage={this.props.addMessage} removeMessage={this.props.removeMessage} />
                    })}

                </ListGroup>
            </div>
    }
}

class OutlookSelection extends React.PureComponent<MessageControlsProps & {hits: EL.MsGraphHit[]}, {}> {
    render() {
        return  <div className={"outlook-results"}>
            <ListGroup>
                { this.props.hits.map((hit, index) => {
                    return <OutlookItem key={index}  included={true} hit={hit} addMessage={this.props.addMessage} removeMessage={this.props.removeMessage} />
                })}
            </ListGroup>
        </div>
    }
}

const ConnectedMessageResults = OutlookSearchHOC({cache: false})(MessageResults);

class OutlookSearch extends React.PureComponent<MessageControlsProps, {query: string}> {
    state = {query: '' }
    render() {
        return <form>
            <div className="search-bar">
                <FormControl type="text" value={this.state.query} placeholder="Search" onChange={(e: any) => this.setState({query: e.target.value})} />
                { this.state.query && <ConnectedMessageResults
                    {...this.props}
                    query={this.state.query}
                    debounce={1000} /> }
            </div>
        </form>
    }
}


interface ImportFromOutlookProps {
    closeModal: () => void;
    matterId?: string;
    contactId?: string;
    type: string;
    isLoading: boolean;
    submit:  (id: string, type: string, data: any) => void;
}

class ImportFromOutlookModal extends React.PureComponent<ImportFromOutlookProps, {hits: EL.MsGraphHit[], hitIds: {[key: string]: boolean}}> {
    state = { hits: [], hitIds: {}}
    addMessage = (hit: EL.MsGraphHit) => {
        this.setState((state) => {
            return {hits: [...state.hits, hit], hitIds: {...state.hitIds, [hit.hitId]: true}}
        })
    }
    removeMessage = (hitId: string) => {
        this.setState((state) => {
            const hitIds = {...state.hitIds};
            delete hitIds[hitId];
            return {
                hits: state.hits.filter(hit => hit.hitId !== hitId),
                hitIds
            }
        });
    }
    render() {
        const { matterId, contactId, type, isLoading } = this.props;
        let title = 'Selected';
        return (
            <Modal bsSize="large" backdrop="static" show={true} onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{ type === 'contact' ? 'Import Outlook Messages' : 'Import Outlook Messages'}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    { isLoading && <Loading/> }
                    { !isLoading && <Tabs id={"outlook-search-tabs"} defaultActiveKey={"search"}>
                        <Tab eventKey={"search"}  title={'Search'} >
                            <OutlookSearch hitIds={this.state.hitIds} addMessage={this.addMessage} removeMessage={this.removeMessage} />
                        </Tab>
                        <Tab eventKey={"selected"} title={title} >
                            <OutlookSelection hitIds={this.state.hitIds} hits={this.state.hits} addMessage={this.addMessage} removeMessage={this.removeMessage} />
                        </Tab>
                    </Tabs> }
                </Modal.Body>

                <Modal.Footer>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={() => {this.props.closeModal()}}>Close</Button>
                        <Button bsStyle="primary" onClick={() => this.props.submit(this.props.matterId || this.props.contactId, this.props.type, this.state.hits)}>{'Import Messages'}</Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
    {
        closeModal: () => closeModal({ modalName: EL.ModalNames.IMPORT_FROM_OUTLOOK}),
        submit: (id: string, type: string, data: EL.MsGraphHit[]) => {
            dispatch(updateView({name: EL.FormNames.IMPORT_FROM_OUTLOOK, isLoading: true}));
            const url = `${type}s/${id}/import-outlook`;
            const meta: EL.Actions.Meta = {
                onSuccess: [
                    createNotification('Messages Imported.'),
                    updateView({name: EL.FormNames.IMPORT_FROM_OUTLOOK, isLoading: false}),
                    closeModal({ modalName: EL.ModalNames.IMPORT_FROM_OUTLOOK })],
                onFailure: [
                    createNotification('Failed to import messages.', true),
                    updateView({name: EL.FormNames.IMPORT_FROM_OUTLOOK, isLoading: false})
                ],
                invalidateList: [`${type}s/${id}`]
            };
            return createResource(url, {internetMessageIds: data.map(data => data.resource.internetMessageId)}, meta)
        }
    },
    dispatch,
)


export default connect(
    (state : EL.State) => ({...(state.modals[EL.ModalNames.IMPORT_FROM_OUTLOOK] || {}), isLoading: !!(state.views[EL.FormNames.IMPORT_FROM_OUTLOOK] || {}).isLoading}),
    mapDispatchToProps,
)(ImportFromOutlookModal as any);