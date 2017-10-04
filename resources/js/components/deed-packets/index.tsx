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

const HEADINGS = ['ID', 'Document Name', 'Document Date', 'Matter ID', 'Created By', 'Actions'];

const data = [{
    id: 1,
    clientName: 'Jeff',
    documentDate: '2017-11-16',
    parties: 'parties',
    matter: 'matter',
    createdBy: 'testing',
}];

interface PacketProps {
    packet: EL.DeedPacket;
    users: EL.User[];
}

class Packet extends React.PureComponent<PacketProps> {
    render() {
        return (
            <div>
                {this.props.packet.title}

                
            </div>
        )
    }
}


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
        const packets = this.props.deedPackets.data;

        return (
            <div>
                <ButtonToolbar>
                    <Link to="/deeds/create" className="btn btn-success"><Icon iconName="plus" />&nbsp;&nbsp;Create Deed Packet</Link>
                </ButtonToolbar>

                <div>
                    <FormControl type="text" value={this.state.searchValue} placeholder="Search" onChange={(e: any) => this.setState({searchValue: e.target.value})} />
                </div>

                <Table headings={HEADINGS}>
                    {packets.map(packet => {
                        const titleRow = (
                            <tr>
                                <th colSpan={5}>{packet.title}</th>
                                    <td>
                                        <ButtonToolbar>
                                            <Link to={`/deed-packets/${packet.id}/edit`} className="btn btn-default btn-sm">Edit</Link>
                                            <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteDeedPacket(packet.id)}>Delete</Button>
                                        </ButtonToolbar>
                                    </td>
                            </tr>
                        );

                        const recordRows = packet.records.map(record => {
                            const createdBy = this.props.users.data.find(u => u.id === record.createdByUserId);

                            return (
                                <tr key={record.id}>
                                    <td>{record.id}</td>
                                    <td>{record.documentName}</td>
                                    <td>{formatDate(record.documentDate)}</td>
                                    <td>{record.matterId}</td>
                                    <td>{name(createdBy)}</td>
                                    <td>
                                        <ButtonToolbar>
                                            <Link to={`/deed-packets/${packet.id}/edit`} className="btn btn-default btn-sm">Edit</Link>
                                            <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteDeedPacket(packet.id)}>Delete</Button>
                                        </ButtonToolbar>
                                    </td>
                                </tr>
                            );
                        });

                        return [titleRow, ...recordRows];
                    })}
                </Table>
            </div>
        );
    }
}

export default DeedPackets;