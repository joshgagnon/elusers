const DEFAULT_STATE = {};

export default function resources(state=DEFAULT_STATE, action: EL.Actions.Action) {
    switch (action.type) {
        case EL.ActionTypes.RESOURCE_FETCHING:
            return {
                ...state,
                [action.payload.key]: {
                    ...(state[action.payload.key] || {}),
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
                    data: undefined,
                    errorData: action.payload.response
                }
            };
        case EL.ActionTypes.UPDATE_RESOURCE_REQUEST:
            return {
                ...state,
                [action.payload.url]: {
                    ...(state[action.payload.url] || {}),
                    status: EL.RequestStatus.FETCHING
                }
            };

        case EL.ActionTypes.CREATE_RESOURCE_SUCCESS:
        case EL.ActionTypes.CREATE_RESOURCE_FAILURE:

        case EL.ActionTypes.UPDATE_RESOURCE_SUCCESS:
        case EL.ActionTypes.UPDATE_RESOURCE_FAILURE:

        case EL.ActionTypes.DELETE_RESOURCE_SUCCESS:
        case EL.ActionTypes.DELETE_RESOURCE_FAILURE:

        case EL.ActionTypes.UPLOAD_COMPLETE:
            // Reset resources state to default
            if(action.meta && action.meta.invalidateList){
                let invalidated = {};
                const keys = Object.keys(state);
                invalidated = keys.reduce((acc, key) => {
                    return action.meta.invalidateList.reduce((acc, invalid) => {
                        if(invalid === key){
                            acc[key] = null;
                        }
                        return acc;
                    }, acc);
                }, {});
                return {...state, ...invalidated};
            }


            return DEFAULT_STATE;
        default:
            return state;
    }
}