import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import resourcesReducer from './resourcesReducer';
import userReducer from './userReducer';
import cpdprReducer from './cpdprReducer';
import notificationsReducer from './notificationsReducer';
import modals from './modalsReducer';
import uploads from './uploads';
import {
    dialogs,
    saved,
    document,
    wizard } from 'jasons-formal/lib/reducers/reducers';

const version = (state={}) => state;

const rootReducer = combineReducers({
    routing,
    form: formReducer,
    resources: resourcesReducer,
    user: userReducer,
    cpdpr: cpdprReducer,
    notifications: notificationsReducer,
    dialogs,
    saved,
    document,
    wizard,
    modals,
    uploads,
    version
});

export default rootReducer;
