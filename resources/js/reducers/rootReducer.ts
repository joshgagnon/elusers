import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import ResourcesReducer from './resourcesReducer';
import UserReducer from './userReducer';

const something = (state=false, action: EvolutionUsers.IAction) => {
    switch (action.type) {
        case EvolutionUsers.EActionTypes.TOGGLE_SOMETHING:
            return !state;
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    routing,
    something,
    resources: ResourcesReducer,
    user: UserReducer
});

export default rootReducer;
