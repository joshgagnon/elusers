import * as React from 'react';
import Card from '../Card';
import Loading from '../loading';

type ResourceObjectOrArray = EL.Resource<any>[] | EL.Resource<any>;

function WaitFor<TProps, TState={}>(checkResources?: (props: TProps) => ResourceObjectOrArray) {
    function some(arrayOrObject, func) {
        if (Array.isArray(arrayOrObject)) {
            return arrayOrObject.some(func);
        }

        return func(arrayOrObject)
    }
    return function(ComposedComponent) {
        class WaitFor extends React.PureComponent<TProps, TState> {
           render() {
                if (checkResources) {
                    const resources = checkResources(this.props);

                    if (some(resources, r => r.hasErrored)) {
                        return <h1>Error</h1>;
                    }

                    if (some(resources, r => r.isFetching || !r.hasStarted)) {
                        return false;
                    }
                }

                return <ComposedComponent {...this.props} />;
            }

        }
    }
}

export default WaitFor;