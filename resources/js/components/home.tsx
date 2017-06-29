import * as React from 'react';
import { connect } from 'react-redux';
import { toggleSomething } from '../actions/index';

interface IHomeProps {
    something: boolean;
    toggleSomething: Function;
}

interface IHomeState {}

class Home extends React.PureComponent<IHomeProps, IHomeState> {
    render() {
        return (
            <div>
                <h1>Dashboard: {this.props.something ? 'true' : 'false'}</h1>
                <button onClick={() => this.props.toggleSomething()}>Toggle Something</button>
            </div>
        );
    }
}

export default connect(state => ({
    something: state.something
}), {
    toggleSomething
})(Home);