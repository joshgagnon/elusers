import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import resourcesReducer from './resourcesReducer';
import userReducer from './userReducer';

const something = (state=false, action: EvolutionUsers.IAction) => {
    switch (action.type) {
        case EvolutionUsers.EActionTypes.TOGGLE_SOMETHING:
            return !state;
        default:
            return state;
    }
};

const cpdprReducer = (state={ yearEndingIndex: 0 }, action: EvolutionUsers.IAction) => {
    switch (action.type) {
        case EvolutionUsers.EActionTypes.UPDATE_CPDPR_YEAR:
            return { ...state, yearEndingIndex: action.payload };
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    routing,
    something,
    resources: resourcesReducer,
    user: userReducer,
    cpdpr: cpdprReducer,
});

export default rootReducer;
