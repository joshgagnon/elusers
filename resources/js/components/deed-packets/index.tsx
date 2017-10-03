import * as React from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import Table from '../dataTable';
import { Link } from 'react-router';
import Icon from '../icon';
import PanelHOC from '../hoc/panelHOC';
import { DeedPacketsHOC, UsersHOC } from '../hoc/resourceHOCs';
import { Button, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { deleteResource } from '../../actions';
import { name, formatDate } from '../utils';

interface DeedPacketsProps {
    users: EL.Resource<EL.User[]>;
    deedPackets: EL.Resource<EL.DeedPacket[]>;
    deleteDeedPacket: (deedPacketId: number) => void;
}

const HEADINGS = ['Client Name', 'Document Date', 'Parties', 'Matter', 'Created By', 'Actions'];

const data = [{
    id: 1,
    clientName: 'Jeff',
    documentDate: '2017-11-16',
    parties: 'parties',
    matter: 'matter',
    createdBy: 'testing',
}];


@connect(undefined, {
    deleteDeedPacket: (deedPacketId: number) => deleteResource(`deed-packets/${deedPacketId}`)
})
@UsersHOC()
@DeedPacketsHOC()
@PanelHOC('Deed Packets', [(props: DeedPacketsProps) => props.deedPackets, (props: DeedPacketsProps) => props.users])
class DeedPackets extends React.PureComponent<DeedPacketsProps, {searchValue: string}> {

    constructor(props: DeedPacketsProps) {
        super(props);
        this.state = {
            searchValue: ''
        };
    }
    render() {
        const deeds = this.props.deedPackets.data.filter(deed => deed.clientTitle.includes(this.state.searchValue));

        return (
            <div>
                <ButtonToolbar>
                    <Link to="/deeds/create" className="btn btn-success"><Icon iconName="plus" />&nbsp;&nbsp;Create Deed Packet</Link>
                </ButtonToolbar>

                <div>
                    <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={(e: any) => this.setState({searchValue: e.target.value})} />
                </div>

                <Table headings={HEADINGS}>
                    { deeds.map(deed => {
                        const createdBy = this.props.users.data.find(u => u.id === deed.createdByUserId);
                        const editLink = `/deed-packets/${deed.id}/edit`;

                        return (
                            <tr key={deed.id}>
                                <td>{deed.clientTitle}</td>
                                <td>{formatDate(deed.documentDate)}</td>
                                <td>{deed.parties}</td>
                                <td>{deed.matter}</td>
                                <td>{name(createdBy)}</td>
                                <td>
                                    <ButtonToolbar>
                                        <Link to={editLink} className="btn btn-default btn-sm">Edit</Link>
                                        <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteDeedPacket(deed.id)}>Delete</Button>
                                    </ButtonToolbar>
                                </td>
                            </tr>
                    )}) }
                </Table>
            </div>
        );
    }
}

export default DeedPackets;