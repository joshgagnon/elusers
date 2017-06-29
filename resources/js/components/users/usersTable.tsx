import * as React from 'react';
import Panel from '../panel';
import Table from '../dataTable';

interface IUsersTableProps {}
interface IUsersTableState {}

export default class UsersTable extends React.PureComponent<IUsersTableProps, IUsersTableState> {
    static HEADINGS = ['Full Name', 'Preferred Name', 'Email', 'Actions'];

    render() {
        return (
            <Panel title="Users">
                <Table headings={UsersTable.HEADINGS}>
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