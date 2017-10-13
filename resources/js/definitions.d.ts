import * as ReduxForm from 'redux-form';

declare global {
    namespace EL {
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

        interface IAddress {
            id?: number;
            addressName: string;
            addressOne: string;
            addressTwo: string;
            addressThree: string;
            postCode: string;
            countryCode: string;
            addressType: string;
        }

        interface DeedPacket {
            id: number;
            title: string;
            createdByUserId: number;
            records: DeedRecord[];
            contactIds: number[];
        }

        interface DeedRecord {
            id: number;
            deedPacketId: number;
            documentName: string;
            documentDate: string;
            parties: string;
            matterId: string;
            destructionDate: string;
            createdByUserId: number;
            officeLocationId: number;
            notes: string;
        }

        interface Contact {
            id: number;
            name: string;
            email: string;
            phone: string;
        }

        interface Office {
            id: number;
            name: string;
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

        interface INotification {
            id: string;
            message: string;
            isError: boolean;
        }

        interface Client {
            id: number;
            title: string;
        }

        interface INotifications extends ObjectOf<INotification> {}

        export interface State {
            routing: any;
            user: User;
            something: boolean;
            resources: StateResources;
            cpdpr: CPDPRState;
            notifications: INotifications;
            modals: Modals;
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
             * Notifications
             */
            CREATE_NOTIFICATION = 'CREATE_NOTIFICATION',
            REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION',

            /**
             * Modals
             */
            SHOW_CONFIRM_ACTION_MODAL = 'SHOW_CONFIRM_ACTION_MODAL',
            CLOSE_MODAL = 'CLOSE_MODAL',

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
            sameAs?: {
                fieldName: string;
                fieldDisplayName: string;
            };
        }

        interface IValidationFields extends ObjectOf<EL.IValidationField> {}

        interface ObjectOf<T> {
            [key: string]: T;
        }

        export const enum ModalNames {
            CONFIRM_ACTION = 'CONFIRM_ACTION',
        }

        interface ConfirmActionModal {
            title: string;
            content: string;
            acceptButtonText: string;
            declineButtonText: string;
            onAccept: EL.Actions.Action;
        }

        interface Modals {
            visible: string;
            confirmActionModal?: ConfirmActionModal;
        }
    }

    namespace EL.Actions {
        export interface Meta {
            onSuccess?: (Action | Function | ReduxForm.FormAction)[];
            onFailure?: (Action | Function | ReduxForm.FormAction)[];
        }

        export interface Action {
            type: string;
            meta?: Meta;
            [key: string]: any;
        }

        interface ShowConfirmActionModalPayload {
            title: string;
            content: string;
            acceptButtonText: string;
            declineButtonText: string;
            onAccept: EL.Actions.Action;
        }

        interface ShowConfirmActionModal extends Action {
            payload: ShowConfirmActionModalPayload;
        }

        interface CloseModalPayload {
            modalName: string;
        }

        interface CloseModal extends Action {
            payload: CloseModalPayload;
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

        interface ICreateNotificationAction extends Action {
            payload: EL.INotification;
        }

        interface IRemoveNotificationAction {
            payload: {
                id: string;
            }
        }
    }

    namespace EL.CPDPR {
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
}

