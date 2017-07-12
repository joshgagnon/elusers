export function toggleSomething() {
    return { type: EvolutionUsers.EActionTypes.TOGGLE_SOMETHING };
};

export function requestResource(resource: string) {
    return {
        type: EvolutionUsers.EActionTypes.RESOURCE_REQUEST,
        payload: { key: resource }
    };
}

export function createResource(url: string, postData: object): EvolutionUsers.Actions.ICreateResourceAction {
    return {
        type: EvolutionUsers.EActionTypes.CREATE_RESOURCE_REQUEST,
        payload: { url, postData }
    }
}

export function deleteResource(url: string) {
    return {
        type: EvolutionUsers.EActionTypes.DELETE_RESOURCE_REQUEST,
        payload: { url }
    };
}

export function updateCPDPRYearIndex(index: number) {
    return {
        type: EvolutionUsers.EActionTypes.UPDATE_CPDPR_YEAR,
        payload: index
    };
}

export function showCreateCPDPRModal() {
    return { type: EvolutionUsers.EActionTypes.SHOW_CREATE_CPDPR_MODAL };
}

export function hideCreateCPDPRModal() {
    return { type: EvolutionUsers.EActionTypes.HIDE_CREATE_CPDPR_MODAL };
}