const DEFAULT_STATE = {};

export default function notificationsReducer(state=DEFAULT_STATE, action: EL.Actions.ICreateNotificationAction & EL.Actions.IRemoveNotificationAction) {
    switch (action.type) {
        case EL.ActionTypes.CREATE_NOTIFICATION:
            return {
                ...state,
                [action.payload.id]: {
                    message: action.payload.message,
                    isError: action.payload.isError
                }
            };
        case EL.ActionTypes.REMOVE_NOTIFICATION:
            return {...state, [action.payload.id]: null};
        default:
            return state;
    }
}