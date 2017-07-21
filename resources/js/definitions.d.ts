declare namespace EL {
    interface User {
        id: number;
        title: string;
        firstName: string;
        middleName?: string;
        surname: string;
        preferredName?: string;
        email: string;
        lawAdmissionDate?: string;
        irdNumber?: string;
        bankAccountNumber?: string;
    }

    interface StateResources {
        users?: {
            status: RequestStatus;
            data: User[];
        };
        [key: string]: {
            status: RequestStatus;
            data: any;
        };
    }

    interface IEmergencyContact {
        id: number;
        name: string;
        email: string;
        phone: string;
    }

    export interface Resource<T> {
        status?: RequestStatus;
        data?: T;
        isFetching: boolean;
        hasErrored: boolean;
    }

    interface CPDPRState {
        yearEndingIndex: number;
        createModalVisible: boolean;
        editRecordId?: number;
    }

    export interface State {
        routing: any;
        user: User;
        something: boolean;
        resources: StateResources;
        cpdpr: CPDPRState;
    }

    export const enum ActionTypes {
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

    export const enum RequestStatus {
        FETCHING = 'FETCHING',
        COMPLETE = 'COMPLETE',
        ERROR = 'ERROR'
    }

    export interface Stateless { }
    export interface Propless { }

    export interface ValidationErrors {
        [key: string]: string
    }

    interface IValidationField {
        name: string;
        required?: boolean;
        maxLength?: number;
        minValue?: number;
        maxValue?: number;
        isDate?: boolean;
        isPhoneNumber?: boolean;
        isBankAccountNumber?: boolean;
    }

    interface IValidationFields extends ObjectOf<EL.IValidationField> {}

    interface ObjectOf<T> {
        [key: string]: T;
    }
}

declare namespace EL.Actions {
    export interface Meta {
        onSuccess?: Action[];
        onFailure?: Action[];
    }

    export interface Action {
        type: string;
        meta?: Meta;
        [key: string]: any;
    }

    export interface CreateResourceAction extends Action {
        payload: {
            url: string;
            postData: object;
        }
    }

    export interface UpdateResourceAction extends Action {
        payload: {
            url: string;
            data: object;
        };
    }

    export interface DeleteResourceAction extends Action {
        payload: {
            url: string;
        };
    }
}

declare namespace EL.CPDPR {
    interface RecordData {
        title: string;
        date: string;
        reflection: string;
        minutes: number;
    }

    interface UpdateRecordData extends RecordData {
        id?: number;
    }

    interface Record extends RecordData {
        id: number;
        editable: boolean;
    }
}