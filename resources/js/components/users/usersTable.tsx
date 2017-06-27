import * as React from 'react';
import Panel from '../../panel';
import { Table } from 'react-bootstrap';

const usersTable = () => (
    <Panel title="Users">
        <Table responsive>
            <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Preferred Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>Somebody</td>
                    <td>Thomas</td>
                    <td>thomas@evolution.nz</td>
                    <td><button className="btn btn-link">Edit</button></td>
                </tr>
            </tbody>
        </Table>
    </Panel>
);

export default usersTable