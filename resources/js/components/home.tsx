import * as React from 'react';
import { connect } from 'react-redux';
import { toggleSomething } from '../actions/index';

export default class Home extends React.PureComponent {
    static readonly FLUID_CONTAINER = true;
    render() {
        return <div>
            <div className=" sea"><p>A law firm for modern New Zealanders</p></div>

        </div>;
    }
}