import * as React from 'react';
import { connect } from 'react-redux';
import { toggleSomething } from '../actions/index';

export default class Home extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return <h2>Dashboard</h2>;
    }
}