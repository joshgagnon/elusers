import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import UserReducer from './userReducer';

const something = (state=false, action: EvolutionUsers.IAction) => {
    switch (action.type) {
        case 'TOGGLE_SOMETHING':
            return !state;
        default:
            return state;
    }
};


const rootReducer = combineReducers({
    routing,
    something,
    user: UserReducer
});

export default rootReducer;
