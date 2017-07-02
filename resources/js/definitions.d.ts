declare namespace EvolutionUsers {
    interface IUser {
        title: string;
        firstName: string;
        middleName?: string;
        lastName: string;
        preferredName?: string;
        email: string;
    }

    interface IStateResources {
        users?: {
            status: ERequestStatus;
            data: IUser[];
        };
        [key: string]: {
            status: ERequestStatus;
            data: any;
        };
    }

    export interface IResource<T> {
        status?: ERequestStatus;
        data?: T;
    }

    export interface IState {
        routing: any;
        user: IUser;
        something: boolean;
        resources: IStateResources;
    }

    export interface IAction {
        type: string;
        payload?: any;
    }

    export const enum EActionTypes {
        RESOURCE_REQUEST = 'RESOURCE_REQUEST',
        RESOURCE_FETCHING = 'RESOURCE_FETCHING',
        RESOURCE_SUCCESS = 'RESOURCE_SUCCESS',
        RESOURCE_FAILURE = 'RESOURCE_FAILURE',

        TOGGLE_SOMETHING = 'TOGGLE_SOMETHING',
    }

    export const enum ERequestStatus {
        FETCHING = 'FETCHING',
        COMPLETE = 'COMPLETE',
        ERROR = 'ERROR'
    }
}