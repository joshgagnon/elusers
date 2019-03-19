import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import Table from '../dataTable';
import { DeadlinesHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHoursString } from '../utils';
import { Button, ButtonGroup, ButtonToolbar, Form } from 'react-bootstrap';
import { deleteResource, confirmAction, showDeadlineModal, updateResource } from '../../actions/index';
import * as moment from 'moment';
import Icon from '../icon';
import { Link } from 'react-router';
import { Calendar } from 'react-widgets'
import { formatDate } from 'components/utils';
import { reduxForm, formValueSelector, FieldArray } from 'redux-form';
import HasPermission from 'components/hoc/hasPermission';
import { hasPermission } from 'components/utils/permissions';

import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';

interface IDeadlinesProps {
    user: EL.User;
    deadlines: EL.Resource<EL.Deadline[]>;
    showCreate: (date: string) => null;
    showUpdate: (deadline: EL.Deadline) => null;
    complete: (deadline: EL.Deadline) => null;
}

interface DeadlineFormProps{
    onSubmit: (data: React.FormEvent<Form>) => void;
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    initialValues?: any;
}

@(reduxForm({
    form: EL.FormNames.CREATE_DEADLINE,
    validate: (values: any) => {
        const errors = {} as any;
        if (!values.title) {
            errors.title = 'Required';
        }
        if (!values.dueAt) {
            errors.dateAt = 'Required';
        }
        if (!values.description) {
            errors.description= 'Required';
        }
        return errors;
    }
}) as any)
export class DeadlineForm extends React.PureComponent<DeadlineFormProps> {
    render() {
       return <Form onSubmit={this.props.handleSubmit} horizontal>
            <InputField name="title" label="Title" type="text" required/>
            <InputField name="description" label="Description" type="text" required/>
           <DatePicker name="dueAt" label="Due Date" required />

            </Form>
    }
}


class DeadlineDetails extends React.PureComponent<{deadline: EL.Deadline}> {
    render() {
        const { deadline, children } = this.props;
        return <div className={`deadline-summary ${deadline.resolvedAt && 'resolved'}`}>
            { deadline.resolvedAt && <h4>Completed</h4> }
            <dl className="dl-horizontal">

            <dt>Title</dt>
            <dd>{ deadline.title }</dd>

            <dt>Due</dt>
            <dd>{ formatDate(deadline.dueAt) }</dd>

            <dt>Description</dt>
            <dd>{ deadline.description }</dd>

            </dl>
            { children }
        </div>
    }
}

@DeadlinesHOC()
@PanelHOC<IDeadlinesProps>('Deadlines', props => props.deadlines)
class Deadlines extends React.PureComponent<IDeadlinesProps> {
    state = { selected: null, _lookup: {} }


    constructor(props: IDeadlinesProps) {
        super(props);
        this.select = this.select.bind(this);
    }

    componentDidMount() {
        this.formatLookup();
    }

    componentDidUpdate(oldProps) {
        if(oldProps.deadlines !== this.props.deadlines) {
            this.formatLookup();
        }
    }

    formatLookup() {
        if(this.props.deadlines.data) {
            this.setState({'_lookup': this.props.deadlines.data.reduce((acc, deadline) => {
                acc[formatDate(deadline.dueAt)] = [...(acc[formatDate(deadline.dueAt)] || []), deadline];
                return acc;
            }, {})});
        }
    }

    select(date) {
        this.setState({selected: date});
    }

    open(date) {
        this.props.showCreate(date);
    }

    showSelection() {
        const matches = this.state._lookup[formatDate(this.state.selected)] || [];

        return <div>
        <br />
        <Button bsStyle="primary" className="pull-right" onClick={() => this.props.showCreate(formatDate(this.state.selected))}>Add Deadline</Button>
        <h3 className="deadline-date-title">{ formatDate(this.state.selected) }</h3>
        { matches.map((m, i) => {
            return <DeadlineDetails key={i}  deadline={m}>
                { hasPermission(this.props.user, 'edit deadlines') &&  <div className="deadline-controls">
                    { !m.resolvedAt && <Button bsSize="sm" bsStyle="success" onClick={() => this.props.complete(m) }><Icon iconName="check" /> Complete</Button> }
                   { !m.resolvedAt && <Button bsSize="sm" bsStyle="warning" onClick={() => this.props.showUpdate(m) }><Icon iconName="pencil" /> Edit</Button> }
                </div> }
            </DeadlineDetails>;
        })}
        { !matches.length && <div><i>No deadlines.</i></div> }
        </div>
    }

    render() {

        let DayComponent = ({ date, label, ...rest }) => {
            date = formatDate(date);
            const matches = (this.state._lookup[date] || [])
            const unresolved = matches.length && matches.some((m) => !m.resolvedAt); 
            let classes = '';
            if(matches.length && unresolved) {
                classes = 'has-deadline';
            }
            else if(matches.length && !unresolved) {
                classes = 'all-resolved';
            }
            return <div className={classes}>
                { label }
            </div>
        };

        return (
            <div className="deadlines">
            <Calendar dayComponent={DayComponent} onChange={this.select} value={this.state.selected}/>
            { this.state.selected && this.showSelection() }
            </div>
        );
    }
}



const ConnectedDeadlines = (connect(
    (state: EL.State) => ({
        user: state.user
    }),
    {
        showCreate: (date) => showDeadlineModal({ date }),
        showUpdate: (deadline) => showDeadlineModal({ deadline }),
        complete: (deadline: EL.Deadline) => {
            const updateAction = updateResource(`deadlines/${deadline.id}`, {...deadline, resolvedAt: new Date()});

            return confirmAction({
                title: 'Confirm Complete Deadline',
                content: 'Are you sure you want to mark this deadline as complete?',
                acceptButtonText: 'Complete',
                declineButtonText: 'Cancel',
                onAccept: updateAction
            });
        },

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

@HasPermission("view deadlines")
export default class DeadlinesPage extends React.PureComponent {
    render() {
        return (
            <div>
                <ConnectedDeadlines  />
                {this.props.children && this.props.children}
            </div>
        );
    }
}