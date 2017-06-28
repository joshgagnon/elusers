import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Layout from './components/layout';

import Home from './components/home';
import UsersTable from './components/users/usersTable';
import EditOrganisation from './components/organisation/editOrganisation';

const routes = () => (
    <BrowserRouter>
        <Layout>
            <Switch>
                <Route exact path='/' component={ Home } />
                <Route exact path='/users' component={ UsersTable } />
                <Route exact path='/organisation' component={ EditOrganisation } />
            </Switch>
        </Layout>
    </BrowserRouter>
);

export default routes;