import * as React from 'react';
import { Table } from 'react-bootstrap';

interface IDataTableProps {
    headings: string[];
    children: any;
}

const DataTable = ({ headings, children }: IDataTableProps) => (
    <Table responsive>
        <thead>
            <tr>{headings.map((heading, index) => <th key={index}>{ heading }</th>)}</tr>
        </thead>

        <tbody>{ children }</tbody>
    </Table>
);

export default DataTable;
