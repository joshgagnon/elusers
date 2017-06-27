"use strict";
import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Navbar from './components/navbar';

ReactDOM.render(
    <Navbar />,
    document.getElementById('main')
);