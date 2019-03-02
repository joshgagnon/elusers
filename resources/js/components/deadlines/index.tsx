import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import Table from '../dataTable';
import { DeadlinesHOC } from '../hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHoursString } from '../utils';
import { Button, ButtonGroup, ButtonToolbar, Form } from 'react-bootstrap';
import { deleteResource, confirmAction, showDeadlineModal } from '../../actions/index';
import * as moment from 'moment';
import Icon from '../icon';
import { Link } from 'react-router';
import { Calendar } from 'react-widgets'
import { formatDate } from 'components/utils';
import { reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';

interface IDeadlinesProps {

    deadlines: EL.Resource<EL.Deadline[]>;
    showCreate: (string) => null;

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
export class DeadlineForm extends React.PureComponent {
    render() {
       return <Form onSubmit={this.props.handleSubmit} horizontal>
           not finished
            <InputField name="title" label="Title" type="text" required/>
            <InputField name="description" label="Description" type="text" required/>
           <DatePicker name="dueAt" label="Due Date" required />

            </Form>
    }
}


class DeadlineDetails extends React.PureComponent<{deadline: EL.Deadline}> {
    render() {
        const { deadline } = this.props;
        return <div>
            <dl>
            <dt>Title</dt>
            <dd>{ deadline.title }</dd>

            <dt>Due</dt>
            <dd>{ formatDate(deadline.dueAt) }</dd>

            <dt>Description</dt>
            <dd>{ deadline.description }</dd>

            </dl>

        </div>
    }
}

@DeadlinesHOC()
@PanelHOC<IDeadlinesProps>('Deadlines', props => props.deadlines)
class Deadlines extends React.PureComponent<IDeadlinesProps> {
    state = { selected: null }
    _lookup = {};

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
            this._lookup = this.props.deadlines.data.reduce((acc, deadline) => {
                acc[deadline.dueAt] = [...(acc[deadline.dueAt] || []), deadline];
                return acc;
            }, {});
        }
    }

    select(date) {
        this.setState({selected: date});
    }

    open(date) {
        this.props.showCreate(date);
    }

    showSelection() {
        const matches = this._lookup[this.state.selected] || [];
        return <div>
        <br />
        <Button bsStyle="primary" className="pull-right" onClick={() => this.props.showCreate(this.state.selected)}>Add Deadline</Button>
        <h3>{ formatDate(this.state.selected) }</h3>
        { matches.map((m, i) => {
            return <DeadlineDetails deadline={m} key={i} />
        })}
        { !matches.length && <div><i>No deadlines.</i></div> }
        </div>
    }

    render() {

        let DayComponent = ({ date, label, ...rest }) => {
            const dates = this.props.deadlines.data;
            return <div style={{ }}>
                { label }
            </div>
        };

        return (
            <div>
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