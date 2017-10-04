import * as React from 'react';
import { Route, IndexRoute, RouteComponent } from 'react-router';

import Home from '../components/home';
import Users from '../components/users';

import Contacts from '../components/contacts';

import { ListDeedPackets, CreateDeedPacket, EditDeedPacket} from '../components/deed-packets';

import UserLayout from '../components/users/userLayout';
import CreateUser from '../components/users/create';
import { ViewBasicDetails, EditBasicDetails } from '../components/users/basicDetails';
import { ViewEmergencyContact, EditEmergencyContact } from '../components/users/emergencyContact';
import { ViewAddresses, EditAddress as EditUserAddress, CreateAddress as CreateUserAddress } from '../components/users/addresses';
import { ChangePassword as ChangeUserPassword } from '../components/users/changePassword';

import CPDPRIndex from '../components/cpdpr';
import EditCPDPRRecord from '../components/cpdpr/edit';
import CreateCPDPRRecord from '../components/cpdpr/create';

import MyProfile from '../components/my-profile';
import BasicDetails from '../components/my-profile/basicDetails';
import EmergencyContact from '../components/my-profile/emergencyContact';
import ChangePassword from '../components/my-profile/changePassword';
import EditOrganisation from '../components/my-profile/organisation';
import Addresses from '../components/my-profile/addresses';
import CreateAddress from '../components/my-profile/createAddress';
import EditAddress from '../components/my-profile/editAddress';

import WikiRoutes from './wiki';

const routes = (routeComponent: RouteComponent) => (
    <Route path='/' component={routeComponent}>
        <IndexRoute component={Home} />
        <Route path='users' component={Users} />
        <Route path='users/create' component={CreateUser} />
        <Route path='users/:userId' component={UserLayout}>
            <IndexRoute component={ViewBasicDetails} />
            <Route path='edit' component={EditBasicDetails} />
            
            <Route path='emergency-contact' component={ViewEmergencyContact} />
            <Route path='emergency-contact/edit' component={EditEmergencyContact} />
            
            <Route path='addresses' component={ViewAddresses} />
            <Route path='addresses/create' component={CreateUserAddress} />
            <Route path='addresses/:addressId/edit' component={EditUserAddress} />

            <Route path="password" component={ChangeUserPassword} />
        </Route>

        <Route path="contacts" component={Contacts} />

        <Route path="deeds" component={ListDeedPackets} />
        <Route path="deeds/create" component={CreateDeedPacket} />
        <Route path="deeds/:deedPacketId/edit" component={EditDeedPacket} />

        <Route path='cpdpr' component={ CPDPRIndex }>
            <Route path='create' component={ CreateCPDPRRecord } />
            <Route path=':cpdprId/edit' component={ EditCPDPRRecord } />
        </Route>

        <Route path="my-profile" component={ MyProfile }>
            <IndexRoute component={ BasicDetails } />
            <Route path="emergency-contact" component={ EmergencyContact } />
            <Route path="password" component={ ChangePassword } />
            <Route path='organisation' component={ EditOrganisation } />
            <Route path="addresses" component={ Addresses } />
            <Route path="addresses/create" component={ CreateAddress } />
            <Route path="addresses/:addressId/edit" component={ EditAddress } />
        </Route>
        { WikiRoutes }
    </Route>
);

export default routes;