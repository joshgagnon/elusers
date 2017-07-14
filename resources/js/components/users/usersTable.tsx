import * as React from 'react';
import Panel from '../panel';
import Table from '../dataTable';
import { UsersHOC } from '../hoc/resourceHOCs';
import { fullname } from '../utils';

interface IUsersTableProps {
    users: EL.Resource<EL.User[]>;
}

interface IUsersTableState {}

const HEADINGS = ['Full Name', 'Preferred Name', 'Email'];

class UsersTable extends React.PureComponent<IUsersTableProps, IUsersTableState> {
    render() {
        if (this.props.users.isFetching) {
            return (
                <Panel title="Users">
                    <h3>Loading!</h3>
                </Panel>
            );
        }

        if (this.props.users.hasErrored) {
            return (
                <Panel title="Users">
                    <h3>Error!</h3>
                </Panel>
            );
        }

        return (
            <Panel title="Users">
                <Table headings={HEADINGS}>
                    { this.props.users.data.map(user => (
                        <tr key={user.id}>
                            <td>{fullname(user)}</td>
                            <td>{user.preferredName || '—'}</td>
                            <td><a href={ 'mailto:' + user.email }>{user.email}</a></td>
                        </tr>
                    )) }
                </Table>
            </Panel>
        );
    }
}

export default UsersHOC()(UsersTable);