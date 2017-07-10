"use strict";
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import configureStore from './configureStore';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'

const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

import ReduxRoot from './reduxRoot';

// CSS
import '../sass/app.scss';
import 'react-widgets/dist/css/react-widgets.css';

ReactDOM.render(
    <ReduxRoot store={store} history={history} />,
    document.getElementById('main')
);