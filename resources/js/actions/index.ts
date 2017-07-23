export function toggleSomething() {
    return { type: EL.ActionTypes.TOGGLE_SOMETHING };
};

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