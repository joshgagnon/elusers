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

const HEADINGS = ['Full Name', 'Preferred Name', 'Email', 'Actions'];

PanelHOC<IUsersTableProps>('Users', props => props.users)
class UsersTable extends React.PureComponent<IUsersTableProps, EL.Stateless> {
    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Link to="/users/create" className="btn btn-success"><Icon iconName="plus" />&nbsp;&nbsp;Create User</Link>
                </ButtonToolbar>

                <Table headings={HEADINGS}>
                    { this.props.users.data.map(user => (
                        <tr key={user.id}>
                            <td>{fullname(user)}</td>
                            <td>{user.preferredName || '—'}</td>
                            <td><a href={ 'mailto:' + user.email }>{user.email}</a></td>
                            <td><Link to={`/users/${user.id}`}>View</Link></td>
                        </tr>
                    )) }
                </Table>
            </div>
        );
    }
}

export default UsersHOC()(UsersTable);