import * as React from 'react';
import { Route, IndexRoute, RouteComponent } from 'react-router';

import Home from './components/home';
import UsersTable from './components/users/usersTable';
import EditOrganisation from './components/organisation/editOrganisation';
import CPDPR from './components/CPDPR';

const routes = (routeComponent: RouteComponent) => (
    <Route path='/' component={ routeComponent }>
        <IndexRoute component={ Home } />
        <Route path='/users' component={ UsersTable } />
        <Route path='/organisation' component={ EditOrganisation } />
        <Route path='/cpdpr' component={ CPDPR } />
    </Route>
);

export default routes;