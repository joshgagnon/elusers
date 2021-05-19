import * as React from 'react';
import { Table } from 'react-bootstrap';

interface IDataTableProps {
    headings: string[];
    children: any;
    manualBodyTag?: boolean;
    lastColIsActions?: boolean;
    bodyRef?: any;
    className?: string;
}

const NO_SORT = (key: string) => {};

class DataTable extends React.PureComponent<IDataTableProps>{
    render() {
        const { headings, children, manualBodyTag, lastColIsActions, bodyRef, className } = this.props;
        return <Table responsive className={className}>
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

        { manualBodyTag ?  children : <tbody ref={bodyRef}>{ children }</tbody> }
    </Table>
    }
}


export default DataTable;
