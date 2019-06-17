import * as React from 'react';
import { connect } from 'react-redux';
import PanelHOC from '../hoc/panelHOC';
import HasPermission from 'components/hoc/hasPermission';
import { hasPermission } from 'components/utils/permissions';
import { ClientRequestsHOC, ClientRequestHOC } from 'components/hoc/resourceHOCs';
import { Link } from 'react-router';
import { fullname } from 'components/utils';
import MapParamsToProps from 'components/hoc/mapParamsToProps';
import { Button } from 'react-bootstrap';
import { createNotification, createResource, updateResource, deleteResource, confirmAction } from 'actions';
import { push } from 'react-router-redux';
import { ReviewContactUsForm  } from 'components/contact-us/contactUs';
import { submit } from 'redux-form';

interface ClientRequestsPanelProps {
    clientRequests?: EL.Resource<EL.ClientRequests>
}

interface ClientRequestPanelProps {
    clientRequest?: EL.Resource<EL.ClientRequest>
    deleteRequest: (string) => void;
    triggerSubmit: () => void;
    submit: (any) => void;
}


const ClientRequestSummaryLink = (props: {clientRequest: EL.ClientRequest}) => {
    const clientRequest = props.clientRequest;
    const contact = clientRequest.data.contact as EL.Contact;
    return <div>
        <Link to={`/client-requests/${clientRequest.id}`}>Request from { fullname(contact) }</Link>
    </div>
}

@HasPermission("view client requests")
@ClientRequestsHOC()
@PanelHOC<ClientRequestsPanelProps>('Client Requests', props => props.clientRequests)
export class ClientRequestsPanel extends React.PureComponent<ClientRequestsPanelProps> {
    render() {
        const clientRequests = this.props.clientRequests.data;
        return (
            <div>
               { clientRequests.map(clientRequest => <ClientRequestSummaryLink clientRequest={clientRequest} key={clientRequest.id} />) }

               { clientRequests.length === 0 && <i>No client requests.</i>  }

            </div>
        );
    }
}


@HasPermission("view client requests")
@MapParamsToProps(['clientRequestId'])
@ClientRequestHOC()
@PanelHOC<ClientRequestPanelProps>('Review Client Request', props => props.clientRequest)
@(connect(undefined, (dispatch, ownProps: {clientRequestId: string}) => ({
    triggerSubmit: () => dispatch(submit(EL.FormNames.CONTACT_US_FORM)),
    submit: (values) => {
        const createAction = createResource(`client-requests/${ownProps.clientRequestId}/create-entities`, values, {
            onSuccess: [createNotification('Client request processed.'), (response) => push(`/matters/${response.results.matter.id}`)],
            onFailure: [createNotification('Client request processing failed. Please try again.', true)],
        });

        return dispatch(confirmAction({
            title: 'Confirm Create',
            content: 'Selecting \'Create\' will create the contacts and matter above',
            acceptButtonText: 'Create',
            declineButtonText: 'Cancel',
            onAccept: createAction
        }));
    },
    deleteRequest: (clientRequestId: string) => {
        const deleteAction = deleteResource(`client-requests/${clientRequestId}`, {
            onSuccess: [createNotification('Client request deleted.'), (response) => push('/')],
            onFailure: [createNotification('Client request failed. Please try again.', true)],
        });

        return dispatch(confirmAction({
            title: 'Confirm Delete Client Request',
            content: 'Are you sure you want to delete this client request?',
            acceptButtonText: 'Delete',
            declineButtonText: 'Cancel',
            onAccept: deleteAction
        }));
    }
})) as any)
export  class ViewClientRequest extends React.PureComponent<ClientRequestPanelProps> {
    deleteRequest = () => this.props.deleteRequest(this.props.clientRequest.data.id);

    render() {
        return (
            <div>
            <ReviewContactUsForm initialValues={this.props.clientRequest.data.data} onSubmit={this.props.submit} />
           <div className="button-row">
                <Button bsStyle="danger" onClick={this.deleteRequest}>Delete Client Request</Button>
                <Button bsStyle="primary" onClick={this.props.triggerSubmit} >Create Contacts and Matter</Button>
            </div>
            </div>
        );
    }
}

@HasPermission("view client requests")
export default class ClientRequestPage extends React.PureComponent {
    render() {
        return (
            <div>
                { this.props.children }
            </div>
        );
    }
}