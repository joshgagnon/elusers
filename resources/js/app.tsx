"use strict";
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Navbar from './components/navbar';
import UsersTable from './components/users/usersTable';

ReactDOM.render(
    <div>
        <Navbar />
        <div className="container">
            <UsersTable />
        </div>
    </div>,
    document.getElementById('main')
);