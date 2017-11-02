import { select, takeEvery, put, call } from 'redux-saga/effects';
import { SagaMiddleware, delay } from 'redux-saga';
import axios from 'axios';
import * as humps from 'humps';
import * as FormData from 'form-data';

function* rootSagas() {
    yield [
        resourceRequests(),
        createResourceRequests(),
        updateResourceRequests(),
        deleteResourceRequests(),

        resourceSuccess(),
        resourceFailure(),

        notificationTimeout(),
    ];
}

export default function runSagas(sagaMiddleware: SagaMiddleware<{}>){
    sagaMiddleware.run(rootSagas);
}

function *resourceRequests() {
    yield takeEvery(EL.ActionTypes.RESOURCE_REQUEST, checkAndRequest);
}

function *createResourceRequests() {
    yield takeEvery(EL.ActionTypes.CREATE_RESOURCE_REQUEST, createResource);
}

function *updateResourceRequests() {
    yield takeEvery(EL.ActionTypes.UPDATE_RESOURCE_REQUEST, updateResource);
}

function *deleteResourceRequests() {
    yield takeEvery(EL.ActionTypes.DELETE_RESOURCE_REQUEST, deleteResource);
}

function *resourceSuccess() {
    yield takeEvery([
        EL.ActionTypes.RESOURCE_SUCCESS,
        EL.ActionTypes.CREATE_RESOURCE_SUCCESS,
        EL.ActionTypes.UPDATE_RESOURCE_SUCCESS,
        EL.ActionTypes.DELETE_RESOURCE_SUCCESS
    ], fireOnSuccessActions);
}

function *resourceFailure() {
    yield takeEvery([
        EL.ActionTypes.RESOURCE_FAILURE,
        EL.ActionTypes.CREATE_RESOURCE_FAILURE,
        EL.ActionTypes.UPDATE_RESOURCE_FAILURE,
        EL.ActionTypes.DELETE_RESOURCE_FAILURE
    ], fireOnFailureActions);
}

function *notificationTimeout() {
    yield takeEvery(EL.ActionTypes.CREATE_NOTIFICATION, setNotificationTimeout);
}

function *setNotificationTimeout(action: EL.Actions.ICreateNotificationAction) {
    const TIMEOUT = 4000;
    yield call(delay, TIMEOUT);
    yield put({ type: EL.ActionTypes.REMOVE_NOTIFICATION, payload: { id: action.payload.id } });
}

function *fireOnSuccessActions(action: EL.Actions.Action) {
    if (action.meta && action.meta.onSuccess) {
        for (const successAction of action.meta.onSuccess) {
            yield put(typeof successAction === 'function' ? successAction(action.payload) : successAction);
        }
    }
}

function *fireOnFailureActions(action: EL.Actions.Action) {
    if (action.meta && action.meta.onFailure) {
        for (const failureAction of action.meta.onFailure) {
            yield put(typeof failureAction === 'function' ? failureAction(action.payload) : failureAction);
        }
    }
}

function *checkAndRequest(action: EL.Actions.Action) {
    // Check to see if this resource exists in state already
    const existing = yield select((state: EL.State) => state.resources[action.payload.key]);

    if (existing) {
        return;
    }

    yield put({ type: EL.ActionTypes.RESOURCE_FETCHING, payload: action.payload });

    try {
        const response = yield call(axios.get, '/api/' + action.payload.key);
        const camelCaseResponseData = humps.camelizeKeys(response.data);
        yield put({
            type: EL.ActionTypes.RESOURCE_SUCCESS,
            payload: {
                response: camelCaseResponseData,
                key: action.payload.key
            }
        });
    } catch (e) {
        yield put({
            type: EL.ActionTypes.RESOURCE_FAILURE,
            payload: {
                response: e,
                key: action.payload.key
            }
        });
    }
}

function *createResource(action: EL.Actions.CreateResourceAction) {
    try {
        // Make the create request
        let data = humps.decamelizeKeys(action.payload.postData);
        if(action.payload.postData.files){
            const body = new FormData();
            Object.keys(data).filter((key: string) => key !== 'files').map((key: string) => {
                body.append(key, data[key])
            });
            action.payload.postData.files.map((d: File) => {
                body.append('file[]', d);
            });
            data = body;
        }
        const response = yield call(axios.post, '/api/' + action.payload.url, data);

        // Fire a create resources success action
        yield put({
            type: EL.ActionTypes.CREATE_RESOURCE_SUCCESS,
            payload: humps.camelizeKeys(response.data),
            meta: action.meta
        });
    } catch (e) {
        // Create failed: fire a create resource failure action
        yield put({
            type: EL.ActionTypes.CREATE_RESOURCE_FAILURE,
            payload: { response: e },
            meta: action.meta
        });
    }
}

function *updateResource(action: EL.Actions.UpdateResourceAction) {
    try {
        // Make the update PUT request
        let data = humps.decamelizeKeys(action.payload.data);
        const response = yield call(axios.put, '/api/' + action.payload.url, data);
        if(action.payload.postData.files){
            const body = new FormData();
            Object.keys(data).filter((key: string) => key !== 'files').map((key: string) => {
                body.append(key, data[key])
            });
            action.payload.postData.files.map((d: File) => {
                if(d.id){
                    body.append('existingFiles[]', d.id);
                }
                else{
                    body.append('file[]', d, d.name);
                }
            });
            data = body;
        }
        // Fire a update resource success action
        yield put({
            type: EL.ActionTypes.UPDATE_RESOURCE_SUCCESS,
            payload: humps.camelizeKeys(response.data),
            meta: action.meta
        });
    } catch (e) {
        // Update failed: fire an update resource failure action
        yield put({
            type: EL.ActionTypes.UPDATE_RESOURCE_FAILURE,
            payload: { response: e },
            meta: action.meta
        })
    }
}

function *deleteResource(action: EL.Actions.DeleteResourceAction) {
    try {
        // Make the delete request
        const response = yield call(axios.delete, '/api/' + action.payload.url);

        // Fire a delete resourse success action
        yield put({
            type: EL.ActionTypes.DELETE_RESOURCE_SUCCESS,
            payload: humps.camelizeKeys(response.data),
            meta: action.meta
        });
    } catch (e) {
        // Delete failed: fire a delete resource failure action
        yield put({
            type: EL.ActionTypes.DELETE_RESOURCE_FAILURE,
            payload: { response: e },
            meta: action.meta
        })
    }
}