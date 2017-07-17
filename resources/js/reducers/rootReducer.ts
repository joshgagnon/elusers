import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import resourcesReducer from './resourcesReducer';
import userReducer from './userReducer';
import cpdprReducer from './cpdprReducer';

const rootReducer = combineReducers({    
    routing,
    form: formReducer,
    resources: resourcesReducer,
    user: userReducer,
    cpdpr: cpdprReducer,
});

export default rootReducer;
