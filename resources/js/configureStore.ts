import { createStore, applyMiddleware, compose, MiddlewareAPI, Dispatch, Middleware } from 'redux';
import rootReducer from './reducers/rootReducer';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import { History } from 'history';
import createSagaMiddleware from 'redux-saga';
import runSagas from './sagas/root';


export default function configureStore(history: History, initialState={}) {
    const loggerMiddleware = createLogger();
    const sagaMiddleware = createSagaMiddleware();

    const middleware = applyMiddleware(
        sagaMiddleware,
        loggerMiddleware,
        routerMiddleware(history)
    );

    const createStoreWithMiddleware = compose(middleware)(createStore);
    const store = createStoreWithMiddleware(rootReducer, initialState);

    // Run our sagas
    runSagas(sagaMiddleware);

    return store;
}
