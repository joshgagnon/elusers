export default function(state={ yearEndingIndex: 0 }, action: EvolutionUsers.IAction) {
    switch (action.type) {
        case EvolutionUsers.EActionTypes.UPDATE_CPDPR_YEAR:
            return { ...state, yearEndingIndex: action.payload };
        default:
            return state;
    }
}