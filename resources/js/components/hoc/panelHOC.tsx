import * as React from 'react';
import Panel from '../panel';
import Loading from '../loading';

type ResourceObjectOrArray = EL.Resource<any>[] | EL.Resource<any>;

function PanelHOC<TProps, TState={}>(title?: string, checkResources?: (props: TProps) => ResourceObjectOrArray) {
    return function(ComposedComponent) {
        function some(arrayOrObject, func) {
            if (Array.isArray(arrayOrObject)) {
                return arrayOrObject.some(func);
            }

            return func(arrayOrObject)
        }

        function PanelContent(props: TProps) {
            let status;

            if (checkResources) {
                const resources = checkResources(props);

                if (some(resources, r => r.hasErrored)) {
                    return <h1>Error</h1>;
                }

                if (some(resources, r => r.isFetching || !r.hasStarted)) {
                    return <Loading />;
                }
            }

            return <ComposedComponent {...props} />;
        }

        class PanelWithContent extends React.PureComponent<TProps, TState> {
            render() {
                return (
                    <Panel title={title}>
                        <PanelContent {...this.props} />
                    </Panel>
                );
            }
        }

        return PanelWithContent;
    }
}

export default PanelHOC;