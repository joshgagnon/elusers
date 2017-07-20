import * as React from 'react';
import UsersTable from './usersTable';

export default class Users extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return <UsersTable />
    }
}