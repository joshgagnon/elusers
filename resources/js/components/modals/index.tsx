import * as React from 'react';
import { connect } from 'react-redux';

import ConfirmAction from './confirmAction';

interface ModalsProps {
    modalState: EL.Modals;
}

class Modals extends React.PureComponent<ModalsProps> {
    render() {
        switch (this.props.modalState.visible) {
            case EL.ModalNames.CONFIRM_ACTION:
                return <ConfirmAction />;
            
            default:
                return false;
        }
    }
}

export default connect(
    (state: EL.State) => ({ modalState: state.modals })
)(Modals);