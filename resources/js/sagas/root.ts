import { select, takeEvery, put, call, fork, take, race } from 'redux-saga/effects';
import { SagaMiddleware, delay, eventChannel, END } from 'redux-saga';
import axios from 'axios';
import * as humps from 'humps';
import * as FormData from 'form-data';
import { downloadSaga, renderSaga } from 'jasons-formal/lib/sagas';
import { mounted, showVersionWarningModal, createNotification, updateUpload, uploadComplete, uploadDocument } from '../actions';

function* rootSagas() {
    yield [
        resourceRequests(),
        createResourceRequests(),
        updateResourceRequests(),
        deleteResourceRequests(),

        uploadDocumentSaga(),
        uploadDocumentTreeSaga(),

        resourceSuccess(),
        resourceFailure(),

        notificationTimeout(),

        longPollVersion(),

        renderSaga(),
        downloadSaga(),

    ];
}

export default function runSagas(sagaMiddleware: SagaMiddleware<{}>){
    sagaMiddleware.run(rootSagas);
}

function *resourceRequests() {
    yield takeFirstRequests(EL.ActionTypes.RESOURCE_REQUEST, checkAndRequest);
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


const takeFirstRequests = (pattern, saga) => fork(function*() {
  let requests = {};
  while (true) {
    const action = yield take(pattern)
    if (!requests[action.payload.key]) {
        requests[action.payload.key] = yield saga(action);
        delete requests[action.payload.key];
    }
  }
})

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

function createFormBody(data, uploadFiles) {
    const body = new FormData();
    const { files, ...rest} = data;
    if(!uploadFiles) {
        return data;
    }
    body.append('__json', JSON.stringify(rest));
    Array.from(uploadFiles).map((d: any) => {
        if(d.id){
            body.append('existing_files[]', d.id);
        }
        else{
            body.append('file[]', d, d.name);
        }
    });
    return body;
}

function *createResource(action: EL.Actions.CreateResourceAction) {
    try {
        // Make the create request
        let data = humps.decamelizeKeys(action.payload.postData);
        if(action.payload.postData.files){
            data = createFormBody(data, action.payload.postData.files);
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
        let response = null;
        let data = humps.decamelizeKeys(action.payload.data);
        if(action.payload.data.files && action.payload.data.files.length){
            const body = new FormData();
            const { files, ...rest} = data;
            body.append('__json', JSON.stringify(rest));
            action.payload.data.files.map((d: any) => {
                if(d.id){
                    body.append('existing_files[]', d.id);
                }
                else{
                    body.append('file[]', d, d.name);
                }
            });
            response = yield call(axios.post, '/api/' + action.payload.url, body);
        }
        else {
            response = yield call(axios.put, '/api/' + action.payload.url, data);
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


// Fetch data every 60 seconds
function* pollVersion() {
    try {
        yield call(delay,60000);
        const hash = yield select((state: EL.State) => state.version.ASSET_HASH);
        const response = yield call(axios.get, `/api/version`);
        if(hash && response.ASSET_HASH && hash !== response.ASSET_HASH){
            yield put(showVersionWarningModal());
        }
        else{
            yield put(mounted());
        }
    } catch (error) {
      yield put(mounted())
      return;
    }
}
export function* longPollVersion() {
    while (true) {
        yield take(EL.ActionTypes.MOUNTED);
        yield race({
          poll: fork(pollVersion)
          //take(EL.ActionTypes.LOGOUT)
        })
    }
}


async function getFile(fileEntry) {
  try {
    return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
  } catch (err) {
    console.log(err);
  }
}


// Get all the entries (files or sub-directories) in a directory by calling readEntries until it returns empty array
async function readAllDirectoryEntries(directoryReader) {
    let entries = [];
    let readEntries = await readEntriesPromise(directoryReader) as any[];
    while (readEntries.length > 0) {
        entries.push(...readEntries);
        readEntries = await readEntriesPromise(directoryReader) as any[];
    }
    return entries;
}

// Wrap readEntries in a promise to make working with readEntries easier
function readEntriesPromise(directoryReader) {
  try {
    return new Promise((resolve, reject) => {
      directoryReader.readEntries(resolve, reject);
    });
  } catch (err) {
    console.log(err);
  }
}
const UPLOAD_DELAY = 300;

function *uploadDocumentTreeSaga() {
    yield takeEvery(EL.ActionTypes.UPLOAD_DOCUMENT_TREE, recurseDocs);

    function *recurseDocs(action: EL.Actions.UploadDocumentTree) {
        const { fileTree, url, parentId } = action.payload;
        let currentParent = parentId;

        function *loop(parentId, fileTree) {
            const files = (Array.from(fileTree) as  DataTransferItem[]).map(file => {
                if(file.webkitGetAsEntry){
                    return file.webkitGetAsEntry();
                }
                return file;
            })
            for(let i=0; i < files.length; i++) {
                let file =  files[i] as any;
                if(file && file.isDirectory) {
                    const result = yield performUploadDocument(uploadDocument({url, parentId, newDirectory: file.name, name: file.name}));
                    if(result) {
                        yield call(delay, UPLOAD_DELAY)

                        const newParentId = result.payload.id;

                        let entries = yield readAllDirectoryEntries(file.createReader());
                        yield loop(newParentId, entries);
                    }
                    //

                }
                else if(file) {
                    const filedata = yield getFile(file);
                    yield performUploadDocument(uploadDocument({url, parentId, name: filedata.name, files: [filedata]}));
                    yield call(delay, UPLOAD_DELAY)
                }
                else{
                    debugger
                }
            }
        }
        return yield loop(parentId, fileTree);
    }
}

function *performUploadDocument(action: EL.Actions.UploadDocument) {
    const documentId = action.documentId;
    const document = yield select((state: EL.State) => state.uploads[action.documentId]);

    yield put(updateUpload(action.documentId, {
        uploadStatus: EL.DocumentUploadStatus.InProgress,
        name: action.payload.name,
        progress: 0
    }));

    // Start the upload process
    const {  url, ...rest} = action.payload;
    const channel = yield call(uploadDocumentProgressEmitter, url, documentId, rest);
    let state : any;
    try {
        while (true) {
            state = yield take(channel);

            yield put(updateUpload(documentId, { ...state }));
        }
    } finally {
        // Set the document upload status to complete

        if(state && state.error){
            //yield put(removeDocument(action.payload.documentId));
            const resolved = false; //yield handleErrors(state.error);
            yield put(updateUpload(documentId, {uploadStatus: EL.DocumentUploadStatus.Failed}));
            if(!resolved){
                yield put(createNotification('You do not have permission to upload documents', true))
            }
        }
        else{

            return yield put(uploadComplete(documentId, {
                id: state.data.id
            }));
        }
    }
}

function uploadDocumentProgressEmitter(url: string, documentId: string, data: any) {
    return eventChannel((emitter) => {
        // Create the form data object for uploading

        data = createFormBody(humps.decamelizeKeys(data), data.files);
        const onUploadProgress = function(progressEvent: any) {
            // Update uploading percentage
            const progress = progressEvent.loaded / progressEvent.total;
            emitter({progress: progress});
        }

        // Upload the document
        const response = axios.post(/api/ + url, data, { onUploadProgress })
            .then((response) => {
                emitter({data: response.data})
                return emitter(END);
            })
            .catch((e) => {
                emitter({status: EL.DocumentUploadStatus.Failed, error: e})
                emitter(END);
            });

        const unsubscribe = () => {};
        return unsubscribe;
    });
}

function *uploadDocumentSaga() {
    yield takeEvery(EL.ActionTypes.UPLOAD_DOCUMENT, performUploadDocument);
}
