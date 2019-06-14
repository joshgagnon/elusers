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


interface ClientRequestsPanelProps {
    clientRequests?: EL.Resource<EL.ClientRequests>
}

interface ClientRequestPanelProps {
    clientRequest?: EL.Resource<EL.ClientRequest>
    deleteRequest: (string) => void;
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
@PanelHOC<ClientRequestPanelProps>('Client Requests', props => props.clientRequest)
@(connect(undefined, {
    deleteRequest: (clientRequestId: string) => {
        const deleteAction = deleteResource(`client-requests/${clientRequestId}`, {
            onSuccess: [createNotification('Client request deleted.'), (response) => push('/')],
            onFailure: [createNotification('Client request failed. Please try again.', true)],
        });

        return confirmAction({
            title: 'Confirm Delete Client Request',
            content: 'Are you sure you want to delete this client request?',
            acceptButtonText: 'Delete',
            declineButtonText: 'Cancel',
            onAccept: deleteAction
        });
    }
}) as any)
export  class ViewClientRequest extends React.PureComponent<ClientRequestPanelProps> {
    deleteRequest = () => this.props.deleteRequest(this.props.clientRequest.data.id);

    render() {
        return (
            <div>
           <div className="button-row">
                <Button bsStyle="danger" onClick={this.deleteRequest}>Delete Client Request</Button>
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