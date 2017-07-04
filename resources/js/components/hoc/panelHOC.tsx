import * as React from 'react';
import Panel from '../panel';

const PanelHOC = (title: string) => (ComposedComponent: React.PureComponent) => {
    return class extends React.PureComponent {
        render() {
            return (
                <Panel title={title}>
                    <ComposedComponent {...this.props} />
                </Panel>
            );
        }
    }
}

export default PanelHOC;