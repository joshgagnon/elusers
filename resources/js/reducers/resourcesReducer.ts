export default function resources(state={}, action: EvolutionUsers.IAction) {
    switch (action.type) {
        case EvolutionUsers.EActionTypes.RESOURCE_REQUEST:
            return {
                ...state,
                [action.payload.key]: {
                    status: EvolutionUsers.ERequestStatus.FETCHING
                }
            };
        case EvolutionUsers.EActionTypes.RESOURCE_SUCCESS:
            return {
                ...state,
                [action.payload.key]: {
                    status: EvolutionUsers.ERequestStatus.COMPLETE,
                    data: action.payload.response
                }
            };
        case EvolutionUsers.EActionTypes.RESOURCE_FAILURE:
            return {
                ...state,
                [action.payload.key]: {
                    status: EvolutionUsers.ERequestStatus.ERROR,
                    data: action.payload.response
                }
            };
        default:
            return state;
    }
}