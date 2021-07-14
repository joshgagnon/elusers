const DEFAULT_STATE = {};

export default function views(state=DEFAULT_STATE, action: EL.Actions.Action) {
    switch (action.type) {
        case EL.ActionTypes.UPDATE_VIEW:
            return {...state, [action.payload.name]: {...(state[action.payload.name] || {}), ...action.payload}}
        default:
            return state;
    }
}