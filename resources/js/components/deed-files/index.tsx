import * as React from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import Table from '../dataTable';
import { Link } from 'react-router';
import Icon from '../icon';
import PanelHOC from '../hoc/panelHOC';

const HEADINGS = ['Client Name', 'Document Date', 'Parties', 'Matter', 'Created By'];

const data = [{
    id: 1,
    clientName: 'Jeff',
    documentDate: '2017-11-16',
    parties: 'parties',
    matter: 'matter',
    createdBy: 'testing',
}];

@PanelHOC('Deed Files')
export default class DeedFiles extends React.PureComponent {
    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Link to="/users/create" className="btn btn-success"><Icon iconName="plus" />&nbsp;&nbsp;Create Deed File</Link>
                </ButtonToolbar>

                <Table headings={HEADINGS}>
                    { data.map(deed => (
                        <tr key={deed.id}>
                            <td>{deed.clientName}</td>
                            <td>{deed.documentDate}</td>
                            <td>{deed.parties}</td>
                            <td>{deed.matter}</td>
                            <td>{deed.createdBy}</td>
                        </tr>
                    )) }
                </Table>
            </div>
        );
    }
}