export default function(state=false, action: EvolutionUsers.IAction) {
    switch (action.type) {
        case 'TOGGLE_SOMETHING':
            return !state;
        default:
            return state;
    }
};