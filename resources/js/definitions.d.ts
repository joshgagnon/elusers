declare namespace EvolutionUsers {
    interface IUser {
        id: number;
        title: string;
        firstName: string;
        middleName?: string;
        surname: string;
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
        isFetching: boolean;
        hasErrored: boolean;
    }

    interface ICPDPRState {
        yearEndingIndex: number;
        createModalVisible: boolean;
        editRecordId?: number;
    }

    export interface IState {
        routing: any;
        user: IUser;
        something: boolean;
        resources: IStateResources;
        cpdpr: ICPDPRState;
    }

    export interface IAction {
        type: string;
        payload?: any;
    }

    export const enum EActionTypes {
        /**
         * Resources
         */
        RESOURCE_REQUEST = 'RESOURCE_REQUEST',
        RESOURCE_FETCHING = 'RESOURCE_FETCHING',
        RESOURCE_SUCCESS = 'RESOURCE_SUCCESS',
        RESOURCE_FAILURE = 'RESOURCE_FAILURE',

        CREATE_RESOURCE_REQUEST = 'CREATE_RESOURCE_REQUEST',
        CREATE_RESOURCE_SUCCESS = 'CREATE_RESOURCE_SUCCESS',
        CREATE_RESOURCE_FAILURE = 'CREATE_RESOURCE_FAILURE',

        UPDATE_RESOURCE_REQUEST = 'UPDATE_RESOURCE_REQUEST',
        UPDATE_RESOURCE_SUCCESS = 'UPDATE_RESOURCE_SUCCESS',
        UPDATE_RESOURCE_FAILURE = 'UPDATE_RESOURCE_FAILURE',

        DELETE_RESOURCE_REQUEST = 'DELETE_RESOURCE_REQUEST',
        DELETE_RESOURCE_SUCCESS = 'DELETE_RESOURCE_SUCCESS',
        DELETE_RESOURCE_FAILURE = 'DELETE_RESOURCE_FAILURE',

        /**
         * CPDPR
         */
        UPDATE_CPDPR_YEAR = 'UPDATE_CPDPR_YEAR',

        SHOW_CREATE_CPDPR_MODAL = 'SHOW_CREATE_CPDPR_MODAL',
        HIDE_CREATE_CPDPR_MODAL = 'HIDE_CREATE_CPDPR_MODAL',

        SHOW_EDIT_CPDPR_RECORD_MODAL = 'SHOW_EDIT_CPDPR_RECORD_MODAL',
        HIDE_EDIT_CPDPR_RECORD_MODAL = 'HIDE_EDIT_CPDPR_RECORD_MODAL',

        /**
         * Initial testing
         */
        TOGGLE_SOMETHING = 'TOGGLE_SOMETHING',
    }

    export const enum ERequestStatus {
        FETCHING = 'FETCHING',
        COMPLETE = 'COMPLETE',
        ERROR = 'ERROR'
    }

    export interface Stateless { }
    export interface Propless { }

    export interface IValidationErrors {
        [key: string]: string
    }
}

declare namespace EvolutionUsers.Actions {
    export interface IAction {
        type: string;
    }

    export interface ICreateResourceAction extends IAction {
        payload: {
            url: string;
            postData: object;
        }
    }

    export interface IUpdateResourceAction extends IAction {
        payload: {
            url: string;
            data: object;
        }
    }
}