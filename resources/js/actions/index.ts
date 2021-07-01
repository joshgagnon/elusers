export function toggleSomething() {
    return { type: EL.ActionTypes.TOGGLE_SOMETHING };
};

/**
 * Resources
 */

export function requestResource(resource: string, meta?: EL.Actions.Meta) {
    return {
        type: EL.ActionTypes.RESOURCE_REQUEST,
        payload: { key: resource },
        meta
    };
}

export function createResource(url: string, postData: object, meta?: EL.Actions.Meta): EL.Actions.CreateResourceAction {
    return {
        type: EL.ActionTypes.CREATE_RESOURCE_REQUEST,
        payload: { url, postData },
        meta
    }
}

export function updateResource( url: string, data: object, meta?: EL.Actions.Meta): EL.Actions.UpdateResourceAction {
    return {
        type: EL.ActionTypes.UPDATE_RESOURCE_REQUEST,
        payload: { url, data },
        meta
    }
}

export function deleteResource(url: string, meta?: EL.Actions.Meta) {
    return {
        type: EL.ActionTypes.DELETE_RESOURCE_REQUEST,
        payload: { url },
        meta
    };
}

let _documentId = 1;
export function getDocumentId() {
    return (_documentId++).toString();
}
// Uploads

export function uploadDocument(payload: EL.Actions.UploadDocumentPayload): EL.Actions.UploadDocument {
    return {
        type: EL.ActionTypes.UPLOAD_DOCUMENT,
        documentId: getDocumentId(),
        payload
    }
}


export function uploadDocumentTree(payload: EL.Actions.UploadDocumentTreePayload): EL.Actions.UploadDocumentTree {
    return {
        type: EL.ActionTypes.UPLOAD_DOCUMENT_TREE,
        payload
    }
}

export function updateUpload(documentId, payload: EL.Actions.UpdateUploadPayload): EL.Actions.UpdateUpload {
    return {
        type: EL.ActionTypes.UPDATE_UPLOAD,
        documentId,
        payload
    }
}

export function uploadComplete(documentId, payload: EL.Actions.UploadCompletePayload): EL.Actions.UploadComplete{
    return {
        type: EL.ActionTypes.UPLOAD_COMPLETE,
        documentId,
        payload
    }
}

/**
 * CPDPR
 */

export function updateCPDPRYearIndex(index: number) {
    return {
        type: EL.ActionTypes.UPDATE_CPDPR_YEAR,
        payload: index
    };
}

export function showCreateCPDPRModal() {
    return { type: EL.ActionTypes.SHOW_CREATE_CPDPR_MODAL };
}

export function hideCreateCPDPRModal() {
    return { type: EL.ActionTypes.HIDE_CREATE_CPDPR_MODAL };
}

/**
 * Notifications
 */

export function createNotification(message: string, isError?: boolean): EL.Actions.ICreateNotificationAction {
    return {
        type: EL.ActionTypes.CREATE_NOTIFICATION,
        payload: {
            id: 'message_' + Math.random(),
            message,
            isError: isError !== undefined ? isError : false
        }
    }
}

/**
 * Modals
 */

export function closeModal(payload: EL.Actions.CloseModalPayload): EL.Actions.CloseModal {
    return {
        type: EL.ActionTypes.CLOSE_MODAL,
        payload
    };
}

export function confirmAction(payload: EL.Actions.ShowConfirmActionModalPayload): EL.Actions.ShowConfirmActionModal {
    return {
        type: EL.ActionTypes.SHOW_CONFIRM_ACTION_MODAL,
        payload
    };
}


export function mounted(): EL.Actions.MountedAction {
    return {
        type: EL.ActionTypes.MOUNTED,
        payload: {}
    };
}

export function showVersionWarningModal(): EL.Actions.ShowVersionWarningModal{
    return {
        type: EL.ActionTypes.SHOW_VERSION_WARNING_MODAL,
        payload: {}
    };
}

export function showAMLCFTToken(payload: EL.Actions.ShowAMLCFTTokenPayload): EL.Actions.ShowAMLCFTToken{
    return {
        type: EL.ActionTypes.SHOW_AMLCFT_MODAL,
        payload
    };
}


export function showCreateContactModal(payload: EL.Actions.ShowCreateContactModalPayload): EL.Actions.ShowCreateContactModal{
    return {
        type: EL.ActionTypes.SHOW_CREATE_CONTACT_MODAL,
        payload
    };
}

export function showUploadModal(payload: EL.Actions.ShowUploadPayload): EL.Actions.ShowUpload{
    return {
        type: EL.ActionTypes.SHOW_UPLOAD_MODAL,
        payload
    };
}

export function showDocumentModal(payload: EL.Actions.ShowDocumentModalPayload): EL.Actions.ShowDocumentModal{
    return {
        type: EL.ActionTypes.SHOW_DOCUMENT_MODAL,
        payload
    };
}

export function showDeadlineModal(payload: EL.Actions.ShowDeadlineModalPayload): EL.Actions.ShowDeadlineModal{
    return {
        type: EL.ActionTypes.SHOW_DEADLINE_MODAL,
        payload
    };
}


export function showAddNoteModal(payload: EL.Actions.ShowAddNoteModalPayload): EL.Actions.ShowAddNoteModal{
    return {
        type: EL.ActionTypes.SHOW_ADD_NOTE_MODAL,
        payload
    };
}

export function showOutlookModal(payload: EL.Actions.ShowOutlookModalPayload): EL.Actions.ShowOutlookModal{
    return {
        type: EL.ActionTypes.SHOW_OUTLOOK_MODAL,
        payload
    };
}


export function updateView(payload: EL.Actions.UpdateViewPayload): EL.Actions.UpdateView{
    return {
        type: EL.ActionTypes.UPDATE_VIEW,
        payload
    };
}