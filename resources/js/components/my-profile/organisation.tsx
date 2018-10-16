import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';

@PanelHOC<{}>('Edit Organisation')
export default class Organisation extends React.PureComponent {
    render() {
        return <div className="alert alert-warning">More options to come</div>
    }
}