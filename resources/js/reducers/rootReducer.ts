import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';


import resourcesReducer from './resourcesReducer';
import userReducer from './userReducer';
import cpdprReducer from './cpdprReducer';


const something = (state=false, action: EL.Actions.Action) => {
    switch (action.type) {
        case EL.ActionTypes.TOGGLE_SOMETHING:
            return !state;
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    something,

    
    routing,
    form: formReducer,
    resources: resourcesReducer,
    user: userReducer,
    cpdpr: cpdprReducer,
});

export default rootReducer;
