import * as React from 'react';
import FormModal from '../formModal';
import CPDPRForm from './form';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { createResource } from '../../actions/index';

interface CreateCPDPRRecordProps {
    userId: number;
    close: () => void;
    submit: (userId:number, data: EL.CPDPR.UpdateRecordData) => void;
}

function mapStateToProps(state: EL.State) {
    return { userId: state.user.id };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        close: () => dispatch(push('/cpdpr')),
        submit: (userId: number, data: EL.CPDPR.UpdateRecordData) => {
            const url = 'cpdpr';
            const dataWithUser = { ...data, user_id: userId };
            const meta = { onSuccess: [push('/cpdpr')] };

            dispatch(createResource(url, dataWithUser, meta));
        }
    }
}

class CreateCPDPRRecord extends React.PureComponent<CreateCPDPRRecordProps> {
    render() {
        return (
            <FormModal title="Create CPDPR Record" formName="cpdpr-form" hide={this.props.close}>
                <CPDPRForm onSubmit={(data: EL.CPDPR.RecordData) => this.props.submit(this.props.userId, data)} />
            </FormModal>
        );
    }
}
export default connect<{}, {}, {userId: number}>(mapStateToProps, mapDispatchToProps)(CreateCPDPRRecord)