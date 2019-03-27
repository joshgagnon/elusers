import * as React from 'react';
import { connect } from 'react-redux';
import PanelHOC from '../hoc/panelHOC';
import { OrganisationDocumentsHOC, ContactDocumentsHOC, MatterDocumentsHOC } from '../hoc/resourceHOCs';
import * as moment from 'moment';
import { DocumentDropZone } from '../form-fields/documents';
import { createNotification, createResource, deleteResource, confirmAction } from '../../actions';
import { Form, ButtonToolbar, Button, Tabs, Tab, FormControl } from 'react-bootstrap';
import { fullname, name } from '../utils';
import { Link } from 'react-router';
import { DocumentsTree } from 'components/documents/documentsTree';
import { hasPermission } from '../utils/permissions';


interface  DocumentsProps {
      documents: EL.Resource<EL.OrganisationDocument[]>;
      canUpdate: boolean;
}

@(connect((state: EL.State) => ({
    canUpdate: hasPermission(state.user, 'manage organisation documents')
})) as any)
@OrganisationDocumentsHOC({cache: true})
export default  class Documents extends React.PureComponent<DocumentsProps> {

    render() {
        return <DocumentsTree
            title="Organisation Documents"
            loading={this.props.documents.isFetching}
            files={this.props.documents.data ? this.props.documents.data : []}
            basePath={`organisation-files`}
            cached={this.props.documents.cached}
            permissionControls={true}
            canUpdate={this.props.canUpdate} />
    }
}