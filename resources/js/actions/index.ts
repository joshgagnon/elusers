import axios from 'axios';

const JSON_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const FETCH_OPTIONS = {
    headers: JSON_HEADERS,
    credentials: 'same-origin'
};


export function toggleSomething() {
    return { type: EvolutionUsers.EActionTypes.TOGGLE_SOMETHING };
};

export function requestResource(resource: string) {
    return {
        type: EvolutionUsers.EActionTypes.RESOURCE_REQUEST,
        payload: { key: resource }
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