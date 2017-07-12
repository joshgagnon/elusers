const DEFAULT_STATE = {};

export default function resources(state=DEFAULT_STATE, action: EvolutionUsers.IAction) {
    switch (action.type) {
        case EvolutionUsers.EActionTypes.RESOURCE_FETCHING:
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
        case EvolutionUsers.EActionTypes.CREATE_RESOURCE_SUCCESS:
        case EvolutionUsers.EActionTypes.CREATE_RESOURCE_FAILURE:
        case EvolutionUsers.EActionTypes.DELETE_RESOURCE_SUCCESS:
        case EvolutionUsers.EActionTypes.DELETE_RESOURCE_FAILURE:
            // Reset resources state to default
            return DEFAULT_STATE;
        default:
            return state;
    }
}