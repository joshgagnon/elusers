import { createStore, applyMiddleware, compose, MiddlewareAPI, Dispatch, Middleware } from 'redux';
import rootReducer from './reducers/rootReducer';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import { History } from 'history';

export default function configureStore(history: History, initialState={}) {
    const loggerMiddleware = createLogger();

    const middleware = applyMiddleware(
          loggerMiddleware,
          routerMiddleware(history)
    );

    const createStoreWithMiddleware = compose(middleware)(createStore);

    return createStoreWithMiddleware(rootReducer, initialState);
}
