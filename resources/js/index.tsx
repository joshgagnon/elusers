"use strict";
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import configureStore from './configureStore';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import * as humps from 'humps';
import ReduxRoot from './reduxRoot';

// CSS
import '../sass/app.scss';
import 'react-widgets/dist/css/react-widgets.css';


// Get the page load data injected when the app is served
let initialState = {} as any;
try {
    const loadData = JSON.parse(document.getElementById("load-data").textContent);
    initialState = humps.camelizeKeys(loadData);
} catch(e) {
    // Do nothing
}
try {
    const version = JSON.parse(document.getElementById("version").textContent);
    initialState.version = version;
} catch(e) {
    // Do nothing
}


const store = configureStore(browserHistory, initialState);
const history = syncHistoryWithStore(browserHistory, store);




ReactDOM.render(
    <ReduxRoot store={store} history={history} />,
    document.getElementById('main')
);