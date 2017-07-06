import * as React from 'react';
import Panel from '../panel';

const PanelHOC = (resources?: any[]) => (ComposedComponent: React.PureComponent<any, any>) => {
    const PanelContent = (props) => {
        let status;

        if (resources) {
            if (resources.some(r => r(props).hasErrored)) {
                return <h1>Error</h1>;
            }

            if (resources.some(r => r(props).isFetching)) {
                return <h1>Loading</h1>;
            }
        }

        return <ComposedComponent {...props} />;
    }

    return class extends React.PureComponent {
        renderBody() {
        }

        render() {
            

            return (
                <Panel>
                    <PanelContent {...this.props} />
                </Panel>
            );
        }
    }
}

export default PanelHOC;