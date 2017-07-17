import * as React from 'react';
import Table from '../dataTable';
import { UsersHOC } from '../hoc/resourceHOCs';
import { fullname } from '../utils';
import PanelHOC from '../hoc/panelHOC';

interface IUsersTableProps {
    users: EL.Resource<EL.User[]>;
}

const HEADINGS = ['Full Name', 'Preferred Name', 'Email'];

@PanelHOC([(props: IUsersTableProps) => props.users])
class UsersTable extends React.PureComponent<IUsersTableProps, EL.Stateless> {
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