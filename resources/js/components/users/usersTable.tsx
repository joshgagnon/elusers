import * as React from 'react';
import Panel from '../panel';
import Table from '../dataTable';
import { UsersHOC } from '../hoc/resourceHOCs';

interface IUsersTableProps {
    users: EvolutionUsers.IResource<EvolutionUsers.IUser[]>;
}
interface IUsersTableState {}

// TODO: inject as property from HOC
function isFetching(resource) {
    return !resource || resource.status === EvolutionUsers.ERequestStatus.FETCHING;
}

const HEADINGS = ['Full Name', 'Preferred Name', 'Email', 'Actions'];

@UsersHOC()
export default class UsersTable extends React.PureComponent<IUsersTableProps, IUsersTableState> {
    render() {
        if (isFetching(this.props.users)) {
            return (
                <Panel title="Users">
                    <h3>Loading!</h3>
                </Panel>
            )
        }

        console.log(this.props);

        return (
            <Panel title="Users">
                <Table headings={HEADINGS}>
                    <tr key={1}>
                        <td>Somebody</td>
                        <td>Thomas</td>
                        <td>thomas@evolution.nz</td>
                        <td><button className="btn btn-link">Edit</button></td>
                    </tr>
                </Table>
            </Panel>
        );
    }
}