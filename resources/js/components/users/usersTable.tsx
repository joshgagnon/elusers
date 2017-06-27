import * as React from 'react';
import Panel from '../panel';
import Table from '../dataTable';

const UsersTable = () => (
    <Panel title="Users">
        <Table headings={['Full Name', 'Preferred Name', 'Email', 'Actions']}>
            <tr key={1}>
                <td>Somebody</td>
                <td>Thomas</td>
                <td>thomas@evolution.nz</td>
                <td><button className="btn btn-link">Edit</button></td>
            </tr>
        </Table>
    </Panel>
);

export default UsersTable;
