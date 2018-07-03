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

