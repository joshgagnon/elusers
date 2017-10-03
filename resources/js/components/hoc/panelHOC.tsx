import * as React from 'react';
import Panel from '../panel';
import Loading from '../loading';

function PanelHOC(title?: string, resources?: any[]) {
    return function<T extends React.Component<any, any>>(ComposedComponent: () => T) {
        function PanelContent(props: T) {
            let status;

            if (resources) {
                if (resources.some(r => r(props).hasErrored)) {
                    return <h1>Error</h1>;
                }

                if (resources.some(r => r(props).isFetching)) {
                    return <Loading />;
                }
            }

            return <ComposedComponent {...props} />;
        }

        class PanelWithContent extends React.PureComponent<any, any> {
            render() {
                return (
                    <Panel title={title}>
                        <PanelContent {...this.props} />
                    </Panel>
                );
            }
        }

        return PanelWithContent;
    } as any
}

export default PanelHOC;