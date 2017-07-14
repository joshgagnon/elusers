import * as React from 'react';
import UsersTable from './usersTable';

export default class Users extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return (
            <div>
                <h2>Users</h2>
                <UsersTable />
            </div>
        );
    }
}