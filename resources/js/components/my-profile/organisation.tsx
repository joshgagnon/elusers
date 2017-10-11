import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';

@PanelHOC<{}>('Edit Organisation')
export default class EmergencyContact extends React.PureComponent {
    render() {
        return <h3>Edit Organisation</h3>;
    }
}