import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { requestResource } from '../../actions/index'

interface IInjectorProps {
    fetch: Function;
}

interface IInjectorState {}

interface IHOCFactoryParameters {
    location: (ownProps: any) => string;
    propsName: string;
}

const HOCFactory = ({location, propsName}: IHOCFactoryParameters) => (ComposedComponent: React.PureComponent) => {
    class Injector extends React.PureComponent<IInjectorProps, IInjectorState> {

        fetch(refresh?: boolean){
            // Set the default of refresh to false
            refresh = refresh !== undefined ? refresh : false;

            // Call the props fetch function
            this.props.fetch(refresh)
        }

        componentWillMount() {
            this.fetch();
        }

        // Only requesting on mount - for now!
        // componentDidUpdate() {
        //     this.fetch();
        // }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    }

    /**
     * Figure out where in props to put the fetched resource
     */
    function stateToProps(state: EvolutionUsers.IState, ownProps: any) {
        // Dig the resource out of state
        const resource = state.resources[location(ownProps)] || null;

        const isFetching = !resource || resource.status === EvolutionUsers.ERequestStatus.FETCHING;
        const hasErrored = resource && resource.status === EvolutionUsers.ERequestStatus.ERROR;

        return { [propsName]: { isFetching, hasErrored, ...resource} };
    }

    function actions(dispatch: Dispatch<any>, ownProps: any) {
        return {
            fetch: (refresh: boolean) => {
                const resource = location(ownProps);
                const options = { refresh };
                return dispatch(requestResource(resource, options));
            }
        };
    }


    return connect(stateToProps, actions)(Injector);
}

export const UsersHOC = () => HOCFactory({ location: () => 'users', propsName: 'users' });
export const UserCPDPRHOC = () => HOCFactory({ location: (props) => `users/${props.userId}/cpdpr`, propsName: 'cpdpr' });