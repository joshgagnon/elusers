const defaultState: EvolutionUsers.ICPDPRState = {
    yearEndingIndex: 0,
    createModalVisible: false
}

export default function(state=defaultState, action: EvolutionUsers.IAction): EvolutionUsers.ICPDPRState {
    switch (action.type) {
        case EvolutionUsers.EActionTypes.UPDATE_CPDPR_YEAR:
            return { ...state, yearEndingIndex: action.payload };

        /**
         * Create CPDPR record
         */
        case EvolutionUsers.EActionTypes.SHOW_CREATE_CPDPR_MODAL:
            return { ...state, createModalVisible: true };
        case EvolutionUsers.EActionTypes.HIDE_CREATE_CPDPR_MODAL:
            return { ...state, createModalVisible: false };

        /**
         * Edit CPDPR record
         */
        case EvolutionUsers.EActionTypes.SHOW_EDIT_CPDPR_RECORD_MODAL:
            return { ...state, editRecordId: action.payload.cpdprId };
        case EvolutionUsers.EActionTypes.HIDE_EDIT_CPDPR_RECORD_MODAL:
            return { ...state, editRecordId: undefined };

        /**
         * Default
         */
        default:
            return state;
    }
}