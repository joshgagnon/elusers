import * as React from 'react';
import Card from '../Card';
import Loading from '../loading';

type ResourceObjectOrArray = EL.Resource<any>[] | EL.Resource<any>;

type CardHOCOptions = {
    errorComponent?: any;
}

function CardHOC<TProps, TState={}>(title?: string, checkResources?: (props: TProps) => ResourceObjectOrArray, options?: CardHOCOptions) {
    options = options || {};
    return function(ComposedComponent) {

        function some(arrayOrObject, func) {
            if (Array.isArray(arrayOrObject)) {
                return arrayOrObject.some(func);
            }

            return func(arrayOrObject)
        }

        function every(arrayOrObject, func) {
            if (Array.isArray(arrayOrObject)) {
                return arrayOrObject.every(func);
            }

            return func(arrayOrObject)
        }

        function CardContent(props: TProps) {
            let status;

            if (checkResources) {
                const resources = checkResources(props);

                if (some(resources, r => r.hasErrored)) {
                    if(options.errorComponent){
                        const Error = options.errorComponent;
                        return <Error />;
                    }
                    return <h1>Error</h1>;
                }

                if (some(resources, r => (r.isFetching || !r.hasStarted) && !r.cached)) {
                    return <Loading />;
                }
                if (some(resources, r => r.cached)) {
                    return <React.Fragment>
                        <Loading overlay show={true}/>
                        <ComposedComponent key={'component'} {...props} />
                       </React.Fragment>
                }

            }

            return <React.Fragment>
                 <Loading overlay show={false}/>
                <ComposedComponent  key={'component'} {...props} />
             </React.Fragment>
        }

        class CardWithContent extends React.PureComponent<TProps, TState> {
            render() {
                return (
                    <Card title={title}>
                        <CardContent {...this.props} />
                    </Card>
                );
            }
        }

        return CardWithContent as any;
    }
}

export default CardHOC;