"use strict";
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Navbar from './components/navbar';
import UsersTable from './components/users/usersTable';

const App = () => (
    <div>
        <Navbar />

        <div className="container">
            <UsersTable />
        </div>
    </div>
);

ReactDOM.render(
    <App />,
    document.getElementById('main')
);