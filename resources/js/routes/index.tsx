import * as React from 'react';
import { Route, IndexRoute, RouteComponent } from 'react-router';

import Home from '../components/home';
import Users from '../components/users/index';

import CPDPRIndex from '../components/cpdpr/index';
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
    <Route path='/' component={ routeComponent }>
        <IndexRoute component={ Home } />
        <Route path='users' component={ Users } />
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