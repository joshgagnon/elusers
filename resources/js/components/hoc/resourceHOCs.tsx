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
    cache: boolean;
}

function HOCFactory({cache, location, propsName}: IHOCFactoryParameters) {
    //return function ConnectedInjector<T extends React.PureComponent<any, any>>(ComposedComponent: () =>  T) {
    return function ConnectedInjector(ComposedComponent: any) : any {
        class Injector extends React.PureComponent<IInjectorProps, IInjectorState> {
            state = {} as any;

            fetch(refresh?: boolean){
                // Set the default of refresh to false
                refresh = refresh !== undefined ? refresh : false;

                // Only fetch if we need to, or refresh is true
                if (refresh || (!this.props[propsName] || !this.props[propsName].hasStarted)) {
                    // Call the props fetch function
                    this.props.fetch(refresh)
                }
            }

            componentWillMount() {
                this.fetch();
            }

            componentDidUpdate(oldProps) {
                if(cache) {
                    if(!this.props[propsName].data && oldProps[propsName].data) {
                        this.setState({[propsName]: {...oldProps[propsName], cached: true}});
                    }
                    else if(this.props[propsName].data) {
                        this.setState({[propsName]: this.props[propsName]});
                    }
                }
                this.fetch();
            }

            render() {
                return <ComposedComponent {...this.props} {...this.state} />;
            }
        }

        /**
         * Figure out where in props to put the fetched resource
         */
        function stateToProps(state: EL.State, ownProps: any) {
            // Dig the resource out of state
            const resource = state.resources[location(ownProps)] || null;

            const hasStarted = !!resource;
            const isFetching = resource && resource.status === EL.RequestStatus.FETCHING;
            const hasErrored = resource && resource.status === EL.RequestStatus.ERROR;

            return { [propsName]: { isFetching, hasErrored, hasStarted, ...resource} };
        }

        function actions(dispatch: Dispatch<any>, ownProps: any) {

            return {
                fetch: (refresh) => {
                    const resource = location(ownProps);
                    return dispatch(requestResource(resource, { refresh }));
                }
            };
        }


        return connect(stateToProps, actions)(Injector);
    }
}

export const UsersHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: () => 'users', propsName: 'users' });
export const UserHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `users/${props.userId}`, propsName: 'user' });

export const UserCPDPRHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `users/${props.user.id}/cpdpr`, propsName: 'cpdpr' });
export const CPDPRHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `cpdpr/${props.recordId}`, propsName: 'record' });

export const UserAddressesHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `users/${props.userId || props.user.id}/addresses`, propsName: 'addresses' });
export const UserAddressHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `addresses/${props.addressId}`, propsName: 'address' });

export const UserEmergencyContactHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `users/${props.userId || props.user.id}/emergency-contact`, propsName: 'emergencyContact' });

export const WikiIndexHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `wiki`, propsName: 'wiki' });
export const WikiHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `wiki/${props.wikiPath}`, propsName: 'wikiPage' });

export const ClientsHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: () => 'clients', propsName: 'clients' });

export const DeedPacketsHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: () => 'deed-packets', propsName: 'deedPackets' });
export const DeedPacketHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `deed-packets/${props.deedPacketId}`, propsName: 'deedPacket' });

export const DeedPacketRecordHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `deed-packet-records/${props.recordId}`, propsName: 'record' });

export const OfficesHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => 'office-locations', propsName: 'offices' });

export const ContactsHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => 'contacts', propsName: 'contacts' });
export const ContactHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `contacts/${props.contactId}`, propsName: 'contact' });

export const ContactAddressesHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `contacts/${props.contactId}/addresses`, propsName: 'addresses' });
export const ContactAddressHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `addresses/${props.addressId}`, propsName: 'address' });

export const OrganisationDocumentsHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `organisation-files`, propsName: 'documents' });
export const ContactDocumentsHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `contact-files`, propsName: 'documents' });
export const MatterDocumentsHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `matter-files`, propsName: 'documents' });

export const MattersHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `matters`, propsName: 'matters' });
export const MatterHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `matters/${props.matterId}`, propsName: 'matter' });

export const TokenHOC = ({cache=false, name} : {cache?: boolean, name: string} = {name: ''}) => HOCFactory({ cache, location: (props) => `access_token/${props.token}`, propsName: name });
export const RolesAndPermissionsHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `roles`, propsName: 'rolesAndPermissions' });

export const DeadlinesHOC = ({cache=false} : {cache?: boolean} = {}) => HOCFactory({ cache, location: (props) => `deadlines`, propsName: 'deadlines' });