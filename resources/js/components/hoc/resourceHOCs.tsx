import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { requestResource } from '../../actions/index'

interface IInjectorProps {
    fetch: Function;
    [key: string]: any;
}

interface IInjectorState {}

interface IHOCFactoryParameters {
    location: (ownProps: any) => string;
    propsName: string;
}

function HOCFactory({location, propsName}: IHOCFactoryParameters) {
    function ConnectedInjector<T extends React.Component<any, any>>(ComposedComponent: () =>  T) {
        class Injector extends React.PureComponent<IInjectorProps, IInjectorState> {

            fetch(refresh?: boolean){
                // Set the default of refresh to false
                refresh = refresh !== undefined ? refresh : false;
                
                // Only fetch if we need to, or refresh is true
                if (refresh || (!this.props[propsName] || !this.props[propsName].status)) {
                    // Call the props fetch function
                    this.props.fetch(refresh)
                }
            }

            componentWillMount() {
                this.fetch();
            }

            componentDidUpdate() {
                this.fetch();
            }

            render() {
                return <ComposedComponent {...this.props} />;
            }
        }

        /**
         * Figure out where in props to put the fetched resource
         */
        function stateToProps(state: EL.State, ownProps: any) {
            // Dig the resource out of state
            const resource = state.resources[location(ownProps)] || null;

            const isFetching = !resource || resource.status === EL.RequestStatus.FETCHING;
            const hasErrored = resource && resource.status === EL.RequestStatus.ERROR;

            return { [propsName]: { isFetching, hasErrored, ...resource} };
        }

        function actions(dispatch: Dispatch<any>, ownProps: any) {
            return {
                fetch: () => {
                    const resource = location(ownProps);
                    return dispatch(requestResource(resource));
                }
            };
        }


        return connect(stateToProps, actions)(Injector);
    }
}

export const UsersHOC = () => HOCFactory({ location: () => 'users', propsName: 'users' });
export const UserCPDPRHOC = () => HOCFactory({ location: (props) => `users/${props.userId}/cpdpr`, propsName: 'cpdpr' });
export const CPDPRHOC = () => HOCFactory({ location: (props) => `cpdpr/${props.recordId}`, propsName: 'record' });