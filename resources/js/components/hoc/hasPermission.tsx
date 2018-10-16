import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { hasPermission } from '../utils/permissions';


function HasPermission(permission: string) {

    return function ConnectedInjector(ComposedComponent: any) : any {
        class Injector extends React.PureComponent<{user: EL.User}> {

           render() {
               if(!hasPermission(this.props.user, permission)){
                   return <div className="alert alert-danger">Forbidden</div>
               }

                return <ComposedComponent {...this.props} />;
            }
        }


        return connect((state: EL.State) => ({user: state.user}))(Injector);
    }
}




export default HasPermission;