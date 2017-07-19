import * as React from 'react';
import FormModal from '../formModal';
import CPDPRForm from './form';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { CPDPRHOC } from '../hoc/resourceHOCs';
import { updateResource } from '../../actions/index';
import Loading from '../loading';

interface IEditCPDPRRecordProps {
    close: () => void;
    submit: (data: EL.CPDPR.RecordData) => void;
    recordId: number;
    record: EL.Resource<EL.CPDPR.Record>;
}

@connect(undefined,
    (dispatch: Dispatch<any>, ownProps: { recordId: number }) => ({
        close: () => dispatch(push('/cpdpr')),
        submit: (data: EL.CPDPR.UpdateRecordData) => dispatch(updateResource(`cpdpr/${ownProps.recordId}`, data, { onSuccess: [push('/cpdpr')] }))
}))
@CPDPRHOC()
class EditCPDPRRecord extends React.PureComponent<IEditCPDPRRecordProps, EL.Stateless> {
    render() {
        return (
            <FormModal title="Edit CPDPR Record" formName="cpdpr-form" hide={this.props.close}>
                { !this.props.record.data && <Loading /> }
                { this.props.record.data && <CPDPRForm onSubmit={this.props.submit} initialValues={this.props.record.data} /> }
            </FormModal>
        );
    }
}

export default class EditCPDPRRecordRouteMapper extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return <EditCPDPRRecord recordId={this.props.params.cpdprId} />
    }
}