import * as React from 'react';
import PanelHOC from './hoc/panelHOC';
import Table from './dataTable';
import { UserCPDPRHOC } from './hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHours } from './utils';
import { Button } from 'react-bootstrap';
import { updateCPDPRYearIndex } from '../actions/index';

interface ICPDPRData {
    records: {
        id: number;
        title: string;
        date: string;
        reflection: string;
        minutes: number;
    }[];
    minutesThisYear: number;
    totalMinutes: number;
    yearEnding: number;
};

interface ICPDPRTableProps {
    recordSet: ICPDPRData;
}

interface ICPDPRTableState {}

interface ICPDPRProps {
    userId: number;
    cpdpr: EvolutionUsers.IResource<ICPDPRData[]>;
    updateCPDPRYearIndex: (year: number) => EvolutionUsers.IAction;
    yearEndingIndex: number;
}

interface ICPDPRState {}

interface IUserCPDPRProps {}
interface IUserCPDPRState {}

class CPDPRTable extends React.PureComponent<ICPDPRTableProps, ICPDPRTableState> {
    render() {
        const HEADINGS = ['Date', 'Title', 'Reflection', 'Hours'];

        return (
            <Table headings={HEADINGS} manualBodyTag>
                <tbody>
                    {
                        this.props.recordSet.records.map(record => (
                            <tr key={record.id}>
                                <td>{record.date}</td>
                                <td>{record.title}</td>
                                <td>{record.reflection}</td>
                                <td>{minutesToHours(record.minutes)}</td>
                            </tr>
                        ))
                    }
                </tbody>

                <tfoot>
                    <tr key="total">
                        <th colSpan={3} className="text-right">Total:</th>
                        <th>{minutesToHours(this.props.recordSet.minutes)}</th>
                    </tr>
                </tfoot>
            </Table>
        );
    }
}

@PanelHOC('CPDPR')
class UserCPDPR extends React.PureComponent<ICPDPRProps, ICPDPRState> {
    constructor(props: ICPDPRProps) {
        super(props);

        this.prevYear = this.prevYear.bind(this);
        this.nextYear = this.nextYear.bind(this);
    }

    nextYear() {
        this.props.updateCPDPRYearIndex(this.props.yearEndingIndex + 1);
    }

    prevYear() {
        this.props.updateCPDPRYearIndex(this.props.yearEndingIndex - 1);
    }

    render() {
        if (this.props.cpdpr.isFetching) {
            return <h1>Loading</h1>;
        }

        if (this.props.cpdpr.hasErrored) {
            return <h1>Error</h1>;
        }

        const years = this.props.cpdpr.data.map(record => record.yearEnding);
        const currentYear = years[this.props.yearEndingIndex];
        const currentRecordSet = this.props.cpdpr.data.filter(d => d.yearEnding === currentYear)[0];

        const disablePrevButton = this.props.yearEndingIndex === 0;
        const disableNextButton = this.props.yearEndingIndex === this.props.cpdpr.data.length - 1

        return (
            <div>
                <Button bsStyle="info" disabled={disablePrevButton} onClick={this.prevYear}>Prev Year</Button>
                <Button bsStyle="info" disabled={disableNextButton} onClick={this.nextYear}>Next Year</Button>
                
                <h3>Year ending: {currentYear}</h3>

                <CPDPRTable recordSet={currentRecordSet} />
            </div>
        );
    }
}

@connect(state => ({
    userId: 1,
    yearEndingIndex: state.cpdpr.yearEndingIndex
}), {
    updateCPDPRYearIndex
})
@UserCPDPRHOC()
export default class CPDPR extends React.PureComponent<IUserCPDPRProps, IUserCPDPRState> {
    render() {
        return <UserCPDPR { ...this.props } />
    }
}