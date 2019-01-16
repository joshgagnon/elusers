const DEFAULT_STATE = {};

export default function uploads(state=DEFAULT_STATE, action: EL.Actions.Action) {
    switch (action.type) {
        case EL.ActionTypes.UPLOAD_DOCUMENT:
            return {...state, [action.payload.documentId]: action.payload}

        case EL.ActionTypes.UPDATE_UPLOAD:
            return {...state, [action.payload.documentId]: {...(state[action.payload.documentId] || {}), ...action.payload}};
        
        case EL.ActionTypes.UPLOAD_COMPLETE:
            return {...state, [action.payload.documentId]: {...(state[action.payload.documentId] || {}), ...action.payload, uploadStatus: EL.DocumentUploadStatus.Complete}};

        default:
            return state;
    }
}