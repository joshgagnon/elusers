import * as React from 'react';
import { Route, IndexRoute, RouteComponent } from 'react-router';

import Home from './components/home';
import Users from './components/users/index';
import EditOrganisation from './components/organisation/editOrganisation';

import CPDPRIndex from './components/cpdpr/index';
import EditCPDPRRecord from './components/cpdpr/edit';
import CreateCPDPRRecord from './components/cpdpr/create';

import MyProfile, { BasicDetails, EmergencyContact } from './components/my-profile';

const routes = (routeComponent: RouteComponent) => (
    <Route path='/' component={ routeComponent }>
        <IndexRoute component={ Home } />
        <Route path='users' component={ Users } />
        <Route path='organisation' component={ EditOrganisation } />
        <Route path='cpdpr' component={ CPDPRIndex }>
            <Route path='create' component={ CreateCPDPRRecord } />
            <Route path=':cpdprId/edit' component={ EditCPDPRRecord } />
        </Route>

        <Route path="my-profile" component={MyProfile}>
            <IndexRoute component={BasicDetails} />
            <Route path="emergency-contact" component={EmergencyContact} />
            <Route path="addresses" component={BasicDetails} />
            <Route path="password" component={BasicDetails} />
        </Route>
    </Route>
);

export default routes;