const defaultState = {
    yearEndingIndex: 0,
    createModalVisible: false
}

export default function(state=defaultState, action: EvolutionUsers.IAction) {
    switch (action.type) {
        case EvolutionUsers.EActionTypes.UPDATE_CPDPR_YEAR:
            return { ...state, yearEndingIndex: action.payload };
        case EvolutionUsers.EActionTypes.SHOW_CREATE_CPDPR_MODAL:
            return { ...state, createModalVisible: true };
        case EvolutionUsers.EActionTypes.HIDE_CREATE_CPDPR_MODAL:
            return { ...state, createModalVisible: false };
        default:
            return state;
    }
}