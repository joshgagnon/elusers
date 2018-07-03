import * as React from 'react';
import { connect } from 'react-redux';

import ConfirmAction from './confirmAction';
import VersionWarning from './versionWarning';
import AMLCFTToken from './amlcftToken';

interface ModalsProps {
    modalState: EL.Modals;
}

class Modals extends React.PureComponent<ModalsProps> {
    render() {
        switch (this.props.modalState.visible) {
            case EL.ModalNames.CONFIRM_ACTION:
                return <ConfirmAction />;
            case EL.ModalNames.VERSION_WARNING:
                return <VersionWarning />;
            case EL.ModalNames.AMLCFT_TOKEN:
                return <AMLCFTToken />
            default:
                return false;
        }
    }
}

export default connect(
    (state: EL.State) => ({ modalState: state.modals })
)(Modals as any);