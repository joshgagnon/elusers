import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import Table from '../dataTable';
import { DeadlinesHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHoursString } from '../utils';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { deleteResource, confirmAction } from '../../actions/index';
import * as moment from 'moment';
import Icon from '../icon';
import { Link } from 'react-router';

interface IDeadlinesData {

};

interface IDeadlinesTableProps {
    recordSet: IDeadlinesData;
    deleteRecord: (deadlineId: number) => void;
}

interface IDeadlinesProps {
    userId: number;
    Deadlines: EL.Resource<IDeadlinesData[]>;
    prevYear: (currentIndex : number) => EL.Actions.Action;
    nextYear: (currentIndex: number) => EL.Actions.Action;
    yearEndingIndex: number;
    deleteRecord: (deadlineId: number) => void;
}

interface IDeadlinesTableRowProps {
    deleteRecord: () => void;
}

class DeadlinesTableRow extends React.PureComponent<IDeadlinesTableRowProps> {
    renderButtons() {
        if (this.props.record.editable) {
            const editLink = `Deadlines/${this.props.record.id}/edit`;

            return (
                <ButtonToolbar>
                    <Link to={editLink} className="btn btn-info btn-sm">Edit</Link>
                    <Button bsStyle="danger" bsSize="sm" onClick={this.props.deleteRecord}>Delete</Button>
                </ButtonToolbar>
            );
        }
    }

    render() {
        const { record } = this.props;
        return (
            <tr>
                <td>{moment(record.date).format('D MMM YYYY')}</td>
                <td>{record.title}</td>
                <td>{record.reflection}</td>
                <td>{minutesToHoursString(record.minutes)}</td>
                <td>{this.renderButtons()}</td>
            </tr>
        );
    }
}

class DeadlinesTable extends React.PureComponent<IDeadlinesTableProps> {
    render() {
        const HEADINGS = ['Date', 'Title', 'Reflection', 'Hours', 'Actions'];

        return (
            <Table headings={HEADINGS} manualBodyTag>
                <tbody>
                    {
                        this.props.recordSet.records.map(record =>
                            <DeadlinesTableRow
                                key={record.id}
                                record={record}
                                deleteRecord={() => this.props.deleteRecord(record.id)} />)
                    }
                </tbody>

                <tfoot>
                    <tr key="total">
                        <th colSpan={3} className="text-right">Total:</th>
                        <th>{minutesToHoursString(this.props.recordSet.minutes)}</th>
                        <td></td>
                    </tr>
                </tfoot>
            </Table>
        );
    }
}


@DeadlinesHOC()
@PanelHOC<IDeadlinesProps>('Deadlines', props => props.deadlines)
class Deadlines extends React.PureComponent<IDeadlinesProps> {
    render() {


        return (
            <div>
            WIP
            </div>
        );
    }
}

const ConnectedDeadlines = (connect(
    (state: EL.State) => ({
        user: state.user
    }),
    {
        deleteRecord: (deadlineId: number) => {
            const deleteAction = deleteResource(`deadlines/${deadlineId}`);

            return confirmAction({
                title: 'Confirm Delete Deadline',
                content: 'Are you sure you want to delete this Deadline?',
                acceptButtonText: 'Delete',
                declineButtonText: 'Cancel',
                onAccept: deleteAction
            });
        }
    }
) as any)(Deadlines);


export default class DeadlinesPage extends React.PureComponent {
    render() {
        return (
            <div>
                <ConnectedDeadlines />
                {this.props.children && this.props.children}
            </div>
        );
    }
}