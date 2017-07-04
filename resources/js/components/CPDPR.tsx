import * as React from 'react';
import PanelHOC from './hoc/panelHOC';
import Table from './dataTable';
import { UserCPDPRHOC } from './hoc/resourceHOCs';
import { connect } from 'react-redux';
import { minutesToHours } from './utils';

interface ICPDPRProps {
    userId: number;
    cpdpr: {
        data: {
            records: {
                id: number;
                title: string;
                date: string;
                reflection: string;
                minutes: number;
            }[];
            subtotalMinutes: number;
            rolloverMinutes: number;
            totalMinutes: number;
        };
    };
}

interface ICPDPRState {}

const HEADINGS = ['Date', 'Title', 'Reflection', 'Hours'];

@PanelHOC('CPDPR')
@UserCPDPRHOC()
export class UserCPDPR extends React.PureComponent<ICPDPRProps, ICPDPRState> {
    render() {
        if (this.props.cpdpr.isFetching) {
            return <h1>here</h1>;
        }

        return (
            <div>
                <Table headings={HEADINGS} manualBodyTag>
                    <tbody>
                        {
                            this.props.cpdpr.data.records.map(record => (
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
                        <tr key="this_year">
                            <th colSpan={3} className="text-right">Subtotal This Year:</th>
                            <th>{minutesToHours(this.props.cpdpr.data.subtotalMinutes + 60)}</th>
                        </tr>
                        <tr key="total_carry_over">
                            <th colSpan={3} className="text-right">Rollover From Last Year:</th>
                            <th>{minutesToHours(this.props.cpdpr.data.rolloverMinutes)}</th>
                        </tr>
                        <tr key="total">
                            <th colSpan={3} className="text-right">Total:</th>
                            <th>{minutesToHours(this.props.cpdpr.data.totalMinutes)}</th>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        );
    }
}

interface IUserCPDPRProps {

}

interface IUserCPDPRState {

}

@connect((state) => ({ userId: state.user.id }))
export default class CPDPR extends React.PureComponent<IUserCPDPRProps, IUserCPDPRState> {
    render() {
        // return <CPDPR userId={this.props.userId} />
        return <UserCPDPR userId={1} />
    }
}