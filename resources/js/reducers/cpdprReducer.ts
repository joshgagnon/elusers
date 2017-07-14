const defaultState: EL.CPDPRState = {
    yearEndingIndex: 0,
    createModalVisible: false
}

export default function(state=defaultState, action: EL.Actions.Action): EL.CPDPRState {
    switch (action.type) {
        case EL.ActionTypes.UPDATE_CPDPR_YEAR:
            return { ...state, yearEndingIndex: action.payload };

        /**
         * Create CPDPR record
         */
        case EL.ActionTypes.SHOW_CREATE_CPDPR_MODAL:
            return { ...state, createModalVisible: true };
        case EL.ActionTypes.HIDE_CREATE_CPDPR_MODAL:
            return { ...state, createModalVisible: false };

        /**
         * Edit CPDPR record
         */
        case EL.ActionTypes.SHOW_EDIT_CPDPR_RECORD_MODAL:
            return { ...state, editRecordId: action.payload.cpdprId };
        case EL.ActionTypes.HIDE_EDIT_CPDPR_RECORD_MODAL:
            return { ...state, editRecordId: undefined };

        /**
         * Default
         */
        default:
            return state;
    }
}