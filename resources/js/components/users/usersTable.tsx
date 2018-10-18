import * as React from 'react';
import Table from '../dataTable';
import { UsersHOC } from '../hoc/resourceHOCs';
import { fullname } from '../utils';
import PanelHOC from '../hoc/panelHOC';
import { Link } from 'react-router';
import Icon from '../icon';
import { ButtonToolbar } from 'react-bootstrap';


interface IUsersTableProps {
    users: EL.Resource<EL.User[]>;
}

const HEADINGS = ['Full Name', 'Preferred Name', 'Email', 'Roles', 'Actions'];

@PanelHOC<IUsersTableProps>('Users', props => props.users)
class UsersTable extends React.PureComponent<IUsersTableProps> {
    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Link to="/my-profile/organisation/users/create" className="btn btn-primary"><Icon iconName="plus" />Create User</Link>
                </ButtonToolbar>

                <Table headings={HEADINGS}>
                    { this.props.users.data.map(user => (
                        <tr key={user.id}>
                            <td>{fullname(user)}</td>
                            <td>{user.preferredName || '—'}</td>
                            <td><a href={ 'mailto:' + user.email }>{user.email}</a></td>
                            <td>{user.roles.map((role, i) => role.name ).join(', ') }</td>
                            <td>

                                <Link  className="btn btn-sm btn-default" to={`/my-profile/organisation/users/${user.id}`}><Icon iconName="eye" />View</Link>


                            </td>
                        </tr>
                    )) }
                </Table>
            </div>
        );
    }
}

export default UsersHOC()(UsersTable);