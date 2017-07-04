import * as React from 'react';
import { Table } from 'react-bootstrap';

interface IDataTableProps {
    headings: string[];
    children: any;
    manualBodyTag?: boolean;
}

const DataTable = ({ headings, children, manualBodyTag }: IDataTableProps) => (
    <Table responsive>
        <thead>
            <tr>{headings.map((heading, index) => <th key={index}>{ heading }</th>)}</tr>
        </thead>

        { manualBodyTag ?  children : <tbody>{ children }</tbody> }
    </Table>
);

export default DataTable;
