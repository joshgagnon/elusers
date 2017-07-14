const DEFAULT_STATE = {
    id: 1
};

export default function(state=DEFAULT_STATE, action: EL.Actions.Action) {
    switch (action.type) {
        default:
            return state;
    }
};