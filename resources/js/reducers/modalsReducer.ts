const DEFAULT_STATE: EL.Modals = {
    visible: null
};

export default function(state: EL.Modals = DEFAULT_STATE, action: any) {
    switch (action.type) {
        case EL.ActionTypes.CLOSE_MODAL:
            return closeModal(state, action);
        
        case EL.ActionTypes.SHOW_CONFIRM_ACTION_MODAL:
            return showConfirmActionModal(state, action);
        
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