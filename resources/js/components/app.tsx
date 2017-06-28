import * as React from 'react';
import Navbar from './navbar';
import UsersTable from './users/usersTable';

const App = () => (
    <div>
        <Navbar />

        <div className="container">
            <UsersTable />
        </div>
    </div>
);

export default App;