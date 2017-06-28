import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UsersTable from './components/users/usersTable';
import EditOrganisation from './components/organisation/editOrganisation'

export default (component) => (
    <Router>
        <div>
            <Route path='/' component={UsersTable} />
            <Route path='/organisation' component={EditOrganisation} />
        </div>
    </Router>
);
