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