const DEFAULT_STATE = {};

export default function resources(state=DEFAULT_STATE, action: EL.Actions.Action) {
    switch (action.type) {
        case EL.ActionTypes.RESOURCE_FETCHING:
            return {
                ...state,
                [action.payload.key]: {
                    status: EL.RequestStatus.FETCHING
                }
            };
        case EL.ActionTypes.RESOURCE_SUCCESS:
            return {
                ...state,
                [action.payload.key]: {
                    status: EL.RequestStatus.COMPLETE,
                    data: action.payload.response
                }
            };
        case EL.ActionTypes.RESOURCE_FAILURE:
            return {
                ...state,
                [action.payload.key]: {
                    status: EL.RequestStatus.ERROR,
                    data: action.payload.response
                }
            };
        case EL.ActionTypes.CREATE_RESOURCE_SUCCESS:
        case EL.ActionTypes.CREATE_RESOURCE_FAILURE:
        
        case EL.ActionTypes.UPDATE_RESOURCE_SUCCESS:
        case EL.ActionTypes.UPDATE_RESOURCE_FAILURE:

        case EL.ActionTypes.DELETE_RESOURCE_SUCCESS:
        case EL.ActionTypes.DELETE_RESOURCE_FAILURE:
            // Reset resources state to default
            return DEFAULT_STATE;
        default:
            return state;
    }
}