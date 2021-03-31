const DEFAULT_STATE: EL.Modals = {
    visible: null
};

export default function(state: EL.Modals = DEFAULT_STATE, action: any) {
    switch (action.type) {
        case EL.ActionTypes.CLOSE_MODAL:
            return closeModal(state, action);

        case EL.ActionTypes.SHOW_CONFIRM_ACTION_MODAL:
            return showConfirmActionModal(state, action);

        case EL.ActionTypes.SHOW_VERSION_WARNING_MODAL:
            return showVersionWarningModal(state, action);

        case EL.ActionTypes.SHOW_AMLCFT_MODAL:
            return showAMLCFTModal(state, action);

        case EL.ActionTypes.SHOW_CREATE_CONTACT_MODAL:
            return showCreateContactModal(state, action);

         case EL.ActionTypes.SHOW_UPLOAD_MODAL:
             return showUploadModal(state, action);

         case EL.ActionTypes.SHOW_DOCUMENT_MODAL:
             return showDocumentModal(state, action);

         case EL.ActionTypes.SHOW_DEADLINE_MODAL:
             return showDeadlineModal(state, action);

        case EL.ActionTypes.SHOW_ADD_NOTE_MODAL:
            return showAddNoteModal(state, action);
        default:
            return state;
    }
}

function closeModal(state: EL.Modals, action: EL.Actions.CloseModal) {
    // If the modal that is to be close isn't the one showing, don't close it
    if (state.visible !== action.payload.modalName) {
        return state;
    }

    return {
        ...state,
        visible: undefined,
        [action.payload.modalName]: undefined // clear out state for that modal
    };
}

function showConfirmActionModal(state: EL.Modals, action: EL.Actions.ShowConfirmActionModal) {
    return {
        ...state,
        visible: EL.ModalNames.CONFIRM_ACTION,
        [EL.ModalNames.CONFIRM_ACTION]: action.payload
    };
}

function showVersionWarningModal(state: EL.Modals, action: EL.Actions.ShowVersionWarningModal) {
    return {
        ...state,
        visible: EL.ModalNames.VERSION_WARNING,
        [EL.ModalNames.VERSION_WARNING]: action.payload
    };
}

function showAMLCFTModal(state: EL.Modals, action: EL.Actions.ShowAMLCFTToken) {
    return {
        ...state,
        visible: EL.ModalNames.AMLCFT_TOKEN,
        [EL.ModalNames.AMLCFT_TOKEN]: action.payload
    };
}


function showCreateContactModal(state: EL.Modals, action: EL.Actions.ShowCreateContactModal) {
    return {
        ...state,
        visible: EL.ModalNames.CREATE_CONTACT,
        [EL.ModalNames.CREATE_CONTACT]: action.payload
    };
}

function showUploadModal(state: EL.Modals, action: EL.Actions.ShowCreateContactModal) {
    return {
        ...state,
        visible: EL.ModalNames.UPLOAD,
        [EL.ModalNames.UPLOAD]: action.payload
    };
}

function showDocumentModal(state: EL.Modals, action: EL.Actions.ShowDocumentModal) {
    return {
        ...state,
        visible: EL.ModalNames.DOCUMENT,
        [EL.ModalNames.DOCUMENT]: action.payload
    };
}


function showDeadlineModal(state: EL.Modals, action: EL.Actions.ShowDeadlineModal) {
    return {
        ...state,
        visible: EL.ModalNames.DEADLINE,
        [EL.ModalNames.DEADLINE]: action.payload
    };
}

function showAddNoteModal(state: EL.Modals, action: EL.Actions.ShowAddNoteModal) {
    return {
        ...state,
        visible: EL.ModalNames.ADD_NOTE,
        [EL.ModalNames.ADD_NOTE]: action.payload
    };
}