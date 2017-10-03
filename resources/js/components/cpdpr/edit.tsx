import * as React from 'react';
import FormModal from '../formModal';
import CPDPRForm from './form';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { CPDPRHOC } from '../hoc/resourceHOCs';
import { updateResource } from '../../actions/index';
import Loading from '../loading';

interface IEditCPDPRRecordProps {
    recordId: number;
}

interface IInjectedEditCPDPRRecordProps extends IEditCPDPRRecordProps {
    close: () => void;
    submit: (data: EL.CPDPR.RecordData) => void;
    record: EL.Resource<EL.CPDPR.Record>;
}

@CPDPRHOC()
class EditCPDPRRecord extends React.PureComponent<IInjectedEditCPDPRRecordProps, EL.Stateless> {
    render() {
        return (
            <FormModal title="Edit CPDPR Record" formName="cpdpr-form" hide={this.props.close}>
                { !this.props.record.data && <Loading /> }
                { this.props.record.data && <CPDPRForm onSubmit={this.props.submit} initialValues={this.props.record.data} /> }
            </FormModal>
        );
    }
}

const ConnectedEditCPDPRRecord = connect<{}, {}, IEditCPDPRRecordProps>(undefined,
    (dispatch: Dispatch<any>, ownProps: { recordId: number }) => ({
        close: () => dispatch(push('/cpdpr')),
        submit: (data: EL.CPDPR.UpdateRecordData) => dispatch(updateResource(`cpdpr/${ownProps.recordId}`, data, { onSuccess: [push('/cpdpr')] }))
}))(EditCPDPRRecord);


export default class EditCPDPRRecordRouteMapper extends React.PureComponent<{params: {cpdprId: number}}> {
    render() {
        return <ConnectedEditCPDPRRecord recordId={this.props.params.cpdprId} />
    }
}