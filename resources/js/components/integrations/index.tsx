import * as React from 'react';
import PanelHOC from "../hoc/panelHOC";
import {connect} from "react-redux";
import {Form} from "react-bootstrap";

interface IIntegrationsProps extends EL.IntegrationDetails {};

@PanelHOC<void>('Integrations')
export class Integrations extends React.PureComponent<IIntegrationsProps> {
    render() {
        const { msgraph } = this.props;
        return <div>
            { !msgraph && <a href={'/msgraph/connect'}>Connect to Outlook</a> }
            { msgraph && <a href={'/msgraph/disconnect'}>Disconnect from Outlook</a> }
        </div>
    }
}

const mapStateToProps = (state: EL.State) : IIntegrationsProps => state.user.integrations;

export default connect<IIntegrationsProps, void, void>(mapStateToProps)(Integrations);