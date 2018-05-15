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
    //return function ConnectedInjector<T extends React.PureComponent<any, any>>(ComposedComponent: () =>  T) {
    return function ConnectedInjector(ComposedComponent: any) : any {
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
export const UserHOC = () => HOCFactory({ location: (props) => `users/${props.userId}`, propsName: 'user' });

export const UserCPDPRHOC = () => HOCFactory({ location: (props) => `users/${props.user.id}/cpdpr`, propsName: 'cpdpr' });
export const CPDPRHOC = () => HOCFactory({ location: (props) => `cpdpr/${props.recordId}`, propsName: 'record' });

export const UserAddressesHOC = () => HOCFactory({ location: (props) => `users/${props.userId || props.user.id}/addresses`, propsName: 'addresses' });
export const UserAddressHOC = () => HOCFactory({ location: (props) => `addresses/${props.addressId}`, propsName: 'address' });

export const UserEmergencyContactHOC = () => HOCFactory({ location: (props) => `users/${props.userId || props.user.id}/emergency-contact`, propsName: 'emergencyContact' });

export const WikiIndexHOC = () => HOCFactory({ location: (props) => `wiki`, propsName: 'wiki' });
export const WikiHOC = () => HOCFactory({ location: (props) => `wiki/${props.wikiPath}`, propsName: 'wikiPage' });

export const ClientsHOC = () => HOCFactory({ location: () => 'clients', propsName: 'clients' });

export const DeedPacketsHOC = () => HOCFactory({ location: () => 'deed-packets', propsName: 'deedPackets' });
export const DeedPacketHOC = () => HOCFactory({ location: (props) => `deed-packets/${props.deedPacketId}`, propsName: 'deedPacket' });

export const DeedPacketRecordHOC = () => HOCFactory({ location: (props) => `deed-packet-records/${props.recordId}`, propsName: 'record' });

export const OfficesHOC = () => HOCFactory({ location: (props) => 'office-locations', propsName: 'offices' });

export const ContactsHOC = () => HOCFactory({ location: (props) => 'contacts', propsName: 'contacts' });
export const ContactHOC = () => HOCFactory({ location: (props) => `contacts/${props.contactId}`, propsName: 'contact' });

export const ContactAddressesHOC = () => HOCFactory({ location: (props) => `contacts/${props.contactId}/addresses`, propsName: 'addresses' });
export const ContactAddressHOC = () => HOCFactory({ location: (props) => `addresses/${props.addressId}`, propsName: 'address' });
