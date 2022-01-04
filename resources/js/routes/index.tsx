import * as React from 'react';
import { Route, IndexRoute, RouteComponent } from 'react-router';

import Home from '../components/home';
import Users from '../components/users';

import { Contact, Contacts, CreateContact, EditContact } from '../components/contacts';
import {  ExternalAMLCFT, ExternalAMLCFTComplete, MergeContact  } from '../components/contacts/amlcft';
import { ExternalContact, ExternalContactComplete } from '../components/contact-us/contactUs';
import { DeedPacket, ListDeedPackets, CreateDeedPacket, EditDeedPacket } from '../components/deeds/packets';
import { DeedRecord, EditDeedRecord, CreateDeedRecord } from '../components/deeds/records';

import UserLayout from '../components/users/userLayout';
import CreateUser from '../components/users/create';
import { ViewBasicDetails, EditBasicDetails } from '../components/users/basicDetails';
import { ViewEmergencyContact, EditEmergencyContact } from '../components/users/emergencyContact';
import { ViewAddresses, EditAddress as EditUserAddress, CreateAddress as CreateUserAddress } from '../components/users/addresses';
import { ChangePassword as ChangeUserPassword } from '../components/users/changePassword';

import CPDPRIndex from '../components/cpdpr';
import EditCPDPRRecord from '../components/cpdpr/edit';
import CreateCPDPRRecord from '../components/cpdpr/create';


import DeadlinesIndex from '../components/deadlines';
import EditDeadline from '../components/deadlines/edit';
import CreateDeadline from '../components/deadlines/create';

import ClientRequestsIndex, { ViewClientRequest } from 'components/client-requests';

import MyProfile from '../components/my-profile';
import BasicDetails from '../components/my-profile/basicDetails';
import EmergencyContact from '../components/my-profile/emergencyContact';
import ChangePassword from '../components/my-profile/changePassword';
import EditOrganisation from '../components/my-profile/organisation';
import Addresses from '../components/my-profile/addresses';
import CreateAddress from '../components/my-profile/createAddress';
import EditAddress from '../components/my-profile/editAddress';
//import Templates from '../components/templates';
import Documents from '../components/documents';
import Integrations from '../components/integrations';
import Roles, { EditRole, CreateRole, UserRoles } from '../components/permissions/roles';

import { ListMatters, CreateMatter, ViewMatter, EditMatter } from '../components/matters';

import WikiRoutes from './wiki';

const routes = (routeComponent: RouteComponent) => (
    <Route path='/' component={routeComponent}>
        <IndexRoute component={Home} />


        <Route path="documents" component={Documents} />

        <Route path="contacts" component={Contacts} />
        <Route path="contacts/create" component={CreateContact} />
        <Route path="contacts/:contactId" component={Contact} />
        <Route path="contacts/:contactId/edit" component={EditContact} />
        <Route path="contacts/:contactId/merge" component={MergeContact} />



        <Route path="deeds" component={ListDeedPackets} />
        <Route path="deeds/create" component={CreateDeedPacket} />
        <Route path="deeds/:deedPacketId" component={DeedPacket} />
        <Route path="deeds/:deedPacketId/edit" component={EditDeedPacket} />

        <Route path="deeds/records/create" component={CreateDeedRecord} />
        <Route path="deeds/records/:recordId" component={DeedRecord} />
        <Route path="deeds/records/:recordId/edit" component={EditDeedRecord} />


        <Route path="matters" component={ListMatters} />
        <Route path="matters/create" component={CreateMatter} />
        <Route path="matters/:matterId" component={ViewMatter} />
        <Route path="matters/:matterId/edit" component={EditMatter} />

        <Route path='cpdpr' component={ CPDPRIndex }>
            <Route path='create' component={ CreateCPDPRRecord } />
            <Route path=':cpdprId/edit' component={ EditCPDPRRecord } />
        </Route>


        <Route path='deadlines' component={ DeadlinesIndex }>
            <Route path='create' component={ CreateDeadline } />
            <Route path=':deadlines/edit' component={ EditDeadline} />
        </Route>

        <Route path='client-requests' component={ClientRequestsIndex}>

            <Route path=':clientRequestId' component={ViewClientRequest} />
        </Route>

        <Route path="my-profile" component={ MyProfile }>
            <IndexRoute component={ BasicDetails } />
            <Route path="emergency-contact" component={ EmergencyContact } />
            <Route path="password" component={ ChangePassword } />
            <Route path="addresses" component={ Addresses } />
            <Route path="addresses/create" component={ CreateAddress } />
            <Route path="addresses/:addressId/edit" component={ EditAddress } />
            <Route path="integrations" component={ Integrations } />

            <Route path="organisation"  >
                <IndexRoute component={ EditOrganisation } />
                <Route path='users' component={Users} />
                <Route path='roles' component={Roles} />
                <Route path='roles/create' component={CreateRole} />
                <Route path='roles/:roleId/edit' component={EditRole} />
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
                    <Route path="roles" component={UserRoles} />
                </Route>
           </Route>

        </Route>

        {/* <Route path="templates" component={ Templates } /> */}

        <Route path="amlcft/complete" component={ ExternalAMLCFTComplete } />
        <Route path="amlcft/:token" component={ ExternalAMLCFT } />

        <Route path="contact-us/complete" component={ ExternalContactComplete } />        
        <Route path="contact-us/:token" component={ ExternalContact } />        

        { WikiRoutes }
    </Route>
);

export default routes;