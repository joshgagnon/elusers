"use strict";
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Router from './routes';

ReactDOM.render(
    <Router />,
    document.getElementById('main')
);