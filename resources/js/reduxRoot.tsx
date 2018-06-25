import * as React from "react";
import { Provider, connect } from 'react-redux';
import Layout from './components/layout';
import routes from './routes/index';
import { Router } from 'react-router';
import { History } from 'history';
import { mounted } from './actions';


interface RootProps {
    history: History,
    store: any,
    mounted?: () => void;
}

@(connect(undefined, {
    mounted,
}) as any)
export default class Root extends React.PureComponent<RootProps, {}> {
    componentDidMount() {
        this.props.mounted();
    }
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