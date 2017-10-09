import * as React from 'react';
import { Table } from 'react-bootstrap';

interface IDataTableProps {
    headings: string[];
    children: any;
    manualBodyTag?: boolean;
    lastColIsActions?: boolean;
}

const DataTable = ({ headings, children, manualBodyTag, lastColIsActions }: IDataTableProps) => (
    <Table responsive>
        <thead>
            <tr>
                {headings.map((heading, index) => {
                    if (lastColIsActions && headings.length === index + 1) {
                        return <th key={index} className="actions">{ heading }</th>
                    }

                    return <th key={index}>{ heading }</th>
                })}
            </tr>
        </thead>

        { manualBodyTag ?  children : <tbody>{ children }</tbody> }
    </Table>
);

export default DataTable;
