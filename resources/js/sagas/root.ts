import { select, takeEvery, put, call } from 'redux-saga/effects';
import axios from 'axios';

function* rootSagas() {
    yield [
        resourceRequests()
    ];
}

export default function runSagas(sagaMiddleware){
    sagaMiddleware.run(rootSagas);
}

function *resourceRequests() {
    yield takeEvery(EvolutionUsers.EActionTypes.RESOURCE_REQUEST, checkAndRequest);
}

function *checkAndRequest(action: EvolutionUsers.IAction) {
    const existing = yield select((state: EvolutionUsers.IState) => state.resources[action.payload.key]);

    if (existing) {
        return;
    }

    yield put({ type: EvolutionUsers.EActionTypes.RESOURCE_FETCHING, payload: action.payload });

    try {
        const response = yield call(axios.get, action.payload.key)
        yield put({type: EvolutionUsers.EActionTypes.RESOURCE_SUCCESS, payload: { response, key: action.payload.key } });
    } catch (e) {
        yield put({type: EvolutionUsers.EActionTypes.RESOURCE_FAILURE, payload: { response: e, key: action.payload.key } });
    }
}