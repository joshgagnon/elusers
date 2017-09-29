import * as React from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import Table from '../dataTable';
import { Link } from 'react-router';
import Icon from '../icon';
import PanelHOC from '../hoc/panelHOC';
import { DeedFilesHOC, UsersHOC } from '../hoc/resourceHOCs';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { deleteResource } from '../../actions';

interface DeedFilesProps {
    users: EL.Resource<EL.User[]>;
    deedFiles: EL.Resource<EL.DeedFile[]>;
    deleteDeedFile: (deedFileId: number) => void;
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
    deleteDeedFile: (deedFileId: number) => deleteResource(`deed-files/${deedFileId}`)
})
@UsersHOC()
@DeedFilesHOC()
@PanelHOC('Deed Files', [(props: DeedFilesProps) => props.deedFiles, (props: DeedFilesProps) => props.users])
class DeedFiles extends React.PureComponent<DeedFilesProps> {
    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Link to="/deed-files/create" className="btn btn-success"><Icon iconName="plus" />&nbsp;&nbsp;Create Deed File</Link>
                </ButtonToolbar>

                <Table headings={HEADINGS}>
                    { this.props.deedFiles.data.map(deed => (
                        <tr key={deed.id}>
                            <td>{deed.clientTitle}</td>
                            <td>{deed.documentDate}</td>
                            <td>{deed.parties}</td>
                            <td>{deed.matter}</td>
                            <td>{this.props.users.data.find(u => u.id === deed.createdByUserId).firstName}</td>
                            <td>
                                <Button bsStyle="danger" bsSize="sm" onClick={() => this.props.deleteDeedFile(deed.id)}>Delete</Button>
                            </td>
                        </tr>
                    )) }
                </Table>
            </div>
        );
    }
}

export default DeedFiles;