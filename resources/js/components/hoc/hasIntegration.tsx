import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { hasPermission } from '../utils/permissions';


function HasIntegration(integration: string) {

    return function ConnectedInjector(ComposedComponent: any) : any {
        class Injector extends React.PureComponent<{[integration: string]: boolean}> {
            render() {
                return <ComposedComponent {...this.props} />;
            }
        }


        return connect((state: EL.State) => ({[integration]: state.user.integrations[integration]}))(Injector);
    }
}




export default HasIntegration;