import * as React from 'react';
import Panel from '../panel';
import Table from '../dataTable';
import { UsersHOC } from '../hoc/resourceHOCs';
import { fullname } from '../utils';
import PanelHOC from '../hoc/panelHOC';

interface IUsersTableProps {
    users: EL.Resource<EL.User[]>;
}

interface IUsersTableState {}

const HEADINGS = ['Full Name', 'Preferred Name', 'Email'];

@PanelHOC([props => props.users])
class UsersTable extends React.PureComponent<IUsersTableProps, IUsersTableState> {
    render() {
        return (
            <Table headings={HEADINGS}>
                { this.props.users.data.map(user => (
                    <tr key={user.id}>
                        <td>{fullname(user)}</td>
                        <td>{user.preferredName || '—'}</td>
                        <td><a href={ 'mailto:' + user.email }>{user.email}</a></td>
                    </tr>
                )) }
            </Table>
        );
    }
}

export default UsersHOC()(UsersTable);