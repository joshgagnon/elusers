import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { requestResource } from '../actions/index'

interface IInjectorProps {
    fetch: Function;
}

interface IInjectorState {}

interface IHOCFactoryParameters {
    location: (ownProps: any) => string;
    propsName: string;
}

const HOCFactory = ({location, propsName}: IHOCFactoryParameters) => (ComposedComponent: React.Component) => {
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

        componentDidUpdate() {
            this.fetch();
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    }

    const DEFAULT = {};

    /**
     * Figure out where in props to put the fetched resource
     */
    function stateToProps(state: EvolutionUsers.IState, ownProps: any) {
        return {
            [propsName]: state.resources[location(ownProps)] || DEFAULT
        }
    }

    function actions(dispatch: Dispatch<any>, ownProps: any) {
        return {
            fetch: (refresh: boolean) => {
                const resource = location(ownProps);
                const options = { refresh };
                return dispatch(requestResource(resource, options));
            }
        }
    }


    return connect(stateToProps, actions)(Injector);
}

export const UsersHOC = () => HOCFactory({ location: () => 'users', propsName: 'users' });