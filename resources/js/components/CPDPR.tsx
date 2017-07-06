import * as React from 'react';
import PanelHOC from './hoc/panelHOC';
import Table from './dataTable';
import { UserCPDPRHOC } from './hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHours } from './utils';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { updateCPDPRYearIndex } from '../actions/index';
import * as moment from 'moment';

interface ICPDPRData {
    records: {
        id: number;
        title: string;
        date: string;
        reflection: string;
        minutes: number;
    }[];
    minutes: number;
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

interface IUserCPDPRProps {
    userId: number;
    yearEndingIndex: number;
}
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
                                <td>{moment(record.date).format('D MMM YYYY')}</td>
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

@PanelHOC([props => props.cpdpr])
class UserCPDPR extends React.PureComponent<ICPDPRProps, ICPDPRState> {
    constructor(props: ICPDPRProps) {
        super(props);

        this.prevYear = this.prevYear.bind(this);
        this.nextYear = this.nextYear.bind(this);
    }

    nextYear() {
        this.props.updateCPDPRYearIndex(this.props.yearEndingIndex - 1);
    }

    prevYear() {
        this.props.updateCPDPRYearIndex(this.props.yearEndingIndex + 1);
    }

    render() {
        const years = this.props.cpdpr.data.map(record => record.yearEnding);
        const currentYear = years[this.props.yearEndingIndex];
        const currentRecordSet = this.props.cpdpr.data[this.props.yearEndingIndex];

        const disablePrevButton = this.props.yearEndingIndex === this.props.cpdpr.data.length - 1;
        const disableNextButton = this.props.yearEndingIndex === 0;

        return (
            <div>
                <strong>Yearly Period:</strong>

                <div className="row title-row">
                    <div className="col-xs-12">
                        <ButtonGroup className="pull-right">
                            <Button disabled={disablePrevButton} onClick={this.prevYear}><Glyphicon glyph="arrow-left" /></Button>
                            <Button disabled={disableNextButton} onClick={this.nextYear}><Glyphicon glyph="arrow-right" /></Button>
                        </ButtonGroup>
                        
                        <h3>1 April {currentRecordSet.yearEnding - 1} to 31 March {currentRecordSet.yearEnding}</h3>
                    </div>
                </div>

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
        return (
            <div>
                <h2>CPDPR</h2>
                <UserCPDPR { ...this.props } />
            </div>
        );
    }
}