const DEFAULT_STATE = {};

export default function notificationsReducer(state=DEFAULT_STATE, action: EL.Actions.ICreateNotificationAction) {
    switch (action.type) {
        case EL.ActionTypes.CREATE_NOTIFICATION:
            return {
                ...state,
                [action.payload.id]: {
                    message: action.payload.message,
                    isError: action.payload.isError
                }
            };
        case EL.ActionTypes.DELETE_NOTIFICATION:
            return { ...state, [action.payload.id]: undefined };
        default:
            return state;
    }
}