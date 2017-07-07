import { select, takeEvery, put, call } from 'redux-saga/effects';
import { SagaMiddleware } from 'redux-saga';
import axios from 'axios';
import * as humps from 'humps';

function* rootSagas() {
    yield [
        resourceRequests()
    ];
}

export default function runSagas(sagaMiddleware: SagaMiddleware<{}>){
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
        const response = yield call(axios.get, '/api/' + action.payload.key);
        const camelCaseResponseData = humps.camelizeKeys(response.data);
        yield put({type: EvolutionUsers.EActionTypes.RESOURCE_SUCCESS, payload: { response: camelCaseResponseData, key: action.payload.key } });
    } catch (e) {
        yield put({type: EvolutionUsers.EActionTypes.RESOURCE_FAILURE, payload: { response: e, key: action.payload.key } });
    }
}