import * as React from "react";
import { Provider, connect } from 'react-redux';
import Layout from './components/layout';
import routes from './routes/index';
import { Router } from 'react-router';
import { History } from 'history';


interface RootProps {
    history: History,
    store: any
}

export default class Root extends React.PureComponent<RootProps, {}> {
    render() {
        return (
            <Provider store={this.props.store}>
                <Router history={this.props.history}>
                    { routes(Layout) }
                    { this.props.children }
                </Router>
            </Provider>
        );
    }
}