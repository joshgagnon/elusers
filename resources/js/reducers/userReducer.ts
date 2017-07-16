const DEFAULT_STATE = {};

export default function(state=DEFAULT_STATE, action: EL.Actions.Action) {
    switch (action.type) {
        default:
            return state;
    }
};