import * as React from 'react';
import { connect } from 'react-redux';

import ConfirmAction from './confirmAction';
import VersionWarning from './versionWarning';
import AMLCFTToken from './amlcftToken';
import CreateContact from './createContact';
import Upload from './upload';
import ViewDocument from './viewDocument';
import Deadline from './deadline';
import AddNote from './addNote';

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
            case EL.ModalNames.CREATE_CONTACT:
                return <CreateContact />
            case EL.ModalNames.UPLOAD:
                return <Upload />
            case EL.ModalNames.DOCUMENT:
                return <ViewDocument />
            case EL.ModalNames.DEADLINE:
                return <Deadline />
            case EL.ModalNames.ADD_NOTE:
                return <AddNote />
            default:
                return false;
        }
    }
}

export default connect(
    (state: EL.State) => ({ modalState: state.modals })
)(Modals as any);