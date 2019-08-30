import * as ReduxForm from 'redux-form';


declare global {


    namespace EL {
        export const enum Constants {
            INDIVIDUAL = 'Individual',
            COMPANY = 'Company',
            TRUST = 'Trust',
            PARTNERSHIP = 'Partnership',
            COURT = 'Court',
            BANK = 'Bank',
            LOCAL_AUTHORITY = 'Local Authority',
            GOVERNMENT_BODY = 'Government Body',
            SIMPLIFIED = 'Simplified',
            STANDARD = 'Standard',
            ENHANCED = 'Enhanced',
            OTHER_CDD = 'Other'
        }

        const enum DocumentUploadStatus {
            NotStarted,
            InProgress,
            Complete,
            Failed
        }

        interface Role {
            id?: number;
            name: string;
            permissions: Permission[]
        }

        type Permission = {
            name: string;
            category?: string;
        }

        interface RolesAndPermissions {
            roles: Role[],
            permissions: Permission[]
        }


        interface User {
            id?: number;
            title: string;
            firstName: string;
            middleName?: string;
            surname: string;State
            preferredName?: string;
            email: string;
            lawAdmissionDate?: string;
            irdNumber?: string;
            bankAccountNumber?: string;
            roles?: Role[];
            permissions?: Permission[];
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
            addressName?: string;
            addressOne: string;
            addressTwo: string;
            addressThree: string;
            postCode: string;
            countryCode: string;
            addressType?: string;
            subType?: string;
        }

        interface DeedPacket {
            id: number;
            title: string;
            createdByUserId: number;
            records: DeedRecord[];
            contactIds: number[];
        }

        interface Document {
            filename?: string;
            name?: string;
            id: number | string;
            createdAt?: string;
            mimeType?: string;
            directory?: boolean;
            protected?: boolean;
            children?: Document[];
            parentId?: string;
            pivot?: {
                createdByUserId?: number;
            }
            permissions?: string[];
            metadata?: any;
        }

        interface OrganisationDocument {
            id: string | number;
            creator?: User;
            file: Document;
        }

        interface MatterDocument {
            id: string | number;
            file: Document;
            matter: Matter;
        }

        interface ContactDocument {
            id: string | number;
            file: Document;
            contact: Contact;
        }

        interface Note {
            id: number | string;
            note: string;
            creator: User;
            createdAt: string;
        }
        interface MatterClient {
            contactId:  string | number;
            authorisedContactId:  string | number;
            client?: EL.Contact;
            authorisedContact?: EL.Contact;
        }


        interface Matter {
            id?: number;
            matterName?: string;
            matterNumber: string;
            matterType: string;
            status: string;
            createdAt: string;
            updatedAt?: string;
            creator: EL.User;
            referrer: EL.User | EL.Contact;
            files: Document[];
            notes: Note[];
            matterClients: MatterClient[];
            filesCount?: number;
            deadlines?: Deadline[];

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
            files: Document[]
        }

        interface Deadline {
            id?: number;
            createdAt: string;
            updatedAt: string;
            dueAt: string;
            resolvedAt: string;
            title: string;
            description: string;
            creator: User;
            matters?: Matter[];
        }

        interface AccessToken {
            token?: string;
            data: any;
            submitted: boolean;
            files: any;
        }

        interface ClientRequest {
            id?: number;
            token: string;
            data: any;
            submitted: boolean;
            files: any;
        }

        type ClientRequests = ClientRequest[];

        interface ContactIndividual {
            firstName: string;
            middleName?: string;
            surname: string;
            title?: string;
            preferredName?: string;
            dateOfBirth?: string;
            dateOfDeath?: string;
            occupation?: string;
            gender?: string;
            maritalStatus?: string;
            countryOfCitizenship?: string;
        }

        interface ContactTrust {
            trustType: string;
            clauseOfTrustDeed?: string;
        }

        interface ContactCompany {
            companyNumber: string;
        }

        interface ContactRelationship {
            relationshipType: string;
            startDate?: string;
            endDate?: string;
            contact?: Contact;
        }

        interface ContactAgent{
            startDate?: string;
            endDate?: string;
            contact?: Contact;
        }

        interface ContactInformation{
            type: 'email' | 'phone' | 'fax' | 'address';
            data: any;
        }

        interface Contact {
            id?: number;
            name?: string;
            contactable: ContactIndividual | ContactCompany | ContactTrust;
            title?: string;
            email?: string;
            phone?: string;
            irdNumber?: string;
            bankAccountNumber?: string;
            cddRequired?: boolean;
            enhancedCcdRequired?: string;
            enhancedCddReason?: string;
            otherCddReason?: string;
            sourceOfFunds?: string;
            reasonNoCddRequired?: string;
            cddType?: string;
            cddCompletionDate?: string;
            files?: Document[]
            accessTokens?: AccessToken[];
            relationships?: ContactRelationship[];
            agents?: ContactAgent[];
            contactableType: string;
            contactInformations?: ContactInformation[];
            matters?: Matter[];
        }

        interface Office {
            id: number;
            name: string;
        }

        export interface Resource<T> {
            status?: RequestStatus;
            data?: T;
            cached?: boolean;
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

        interface DocumentUpload {
            files: File[];
            name: string;
            uploadStatus: DocumentUploadStatus,
            progress: number,
            size?: number;
        }

        interface Uploads {
            [documentId: string]: DocumentUpload
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
            uploads: Uploads;
            version: {
                ASSET_HASH: string;
            }
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

            SHOW_CREATE_CONTACT_MODAL = 'SHOW_CREATE_CONTACT_MODAL',
            HIDE_CREATE_CONTACT_MODAL = 'HIDE_CREATE_CONTACT_MODAL',

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
            SHOW_VERSION_WARNING_MODAL = 'SHOW_VERSION_WARNING_MODAL',
            SHOW_AMLCFT_MODAL = 'SHOW_AMLCFT_MODAL',
            SHOW_UPLOAD_MODAL = 'SHOW_UPLOAD_MODAL',
            SHOW_DOCUMENT_MODAL = 'SHOW_DOCUMENT_MODAL',
            SHOW_DEADLINE_MODAL = 'SHOW_DEADLINE_MODAL',
            /**
             * Initial testing
             */
            TOGGLE_SOMETHING = 'TOGGLE_SOMETHING',

            MOUNTED =  'MOUNTED',

            UPLOAD_DOCUMENT = 'UPLOAD_DOCUMENT',
            UPLOAD_DOCUMENT_TREE = 'UPLOAD_DOCUMENT_TREE',
            UPDATE_UPLOAD = 'UPDATE_UPLOAD',
            UPLOAD_COMPLETE = 'UPLOAD_COMPLETE',

            SAVE_TO_LOCAL_STORAGE = 'SAVE_TO_LOCAL_STORAGE',
            LOAD_FROM_LOCAL_STORAGE = 'LOAD_FROM_LOCAL_STORAGE',
        }

        export const enum RequestStatus {
            FETCHING = 'FETCHING',
            COMPLETE = 'COMPLETE',
            ERROR = 'ERROR'
        }

        export interface ValidationErrors {
            [key: string]: any
        }

        interface IValidationField {
            name: string;
            required?: boolean;
            maxLength?: number;
            minValue?: number;
            maxValue?: number;
            minItems?: number;
            isDate?: boolean;
            map?: {[key: string]: IValidationField};
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
            VERSION_WARNING = 'VERSION_WARNING',
            AMLCFT_TOKEN = 'AMLCFT_TOKEN',
            CREATE_CONTACT = 'CREATE_CONTACT',
            DEADLINE = 'DEADLINE',
            UPLOAD = 'UPLOAD',
            DOCUMENT = 'DOCUMENT'
        }

        export const enum FormNames {
            CREATE_DEED_RECORD = 'CREATE_DEED_RECORD',
            EDIT_DEED_RECORD = 'EDIT_DEED_RECORD',

            CREATE_DEED_PACKET = 'CREATE_DEED_PACKET',
            EDIT_DEED_PACKET = 'EDIT_DEED_PACKET',

            CREATE_CONTACT_FORM = 'CREATE_CONTACT_FORM',
            CREATE_CONTACT_FORM_SIMPLE = 'CREATE_CONTACT_FORM_SIMPLE',
            EDIT_CONTACT_FORM = 'EDIT_CONTACT_FORM',
            EDIT_CONTACT_AMLCFT_FORM = 'EDIT_CONTACT_AMLCFT_FORM',

            CREATE_MATTER_FORM = 'CREATE_MATTER_FORM',
            EDIT_MATTER_FORM = 'EDIT_MATTER_FORM',

            CREATE_ROLE_FORM = 'CREATE_ROLE_FORM',
            EDIT_ROLE_FORM = 'EDIT_ROLE_FORM',

            CREATE_DEADLINE = 'CREATE_DEADLINE',
            EDIT_DEADLINE = 'EDIT_DEADLINE',

            EDIT_USER_ROLES_FORM= 'EDIT_USER_ROLES_FORM',
            CONTACT_US_FORM='CONTACT_US_FORM'

        }

        interface ConfirmActionModal {
            title: string;
            content: string;
            acceptButtonText: string;
            declineButtonText: string;
            onAccept: EL.Actions.Action | EL.Actions.Action[];
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
            refresh?: boolean;
            invalidateList?: string[];

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
            onAccept: EL.Actions.Action  | EL.Actions.Action[];
        }

        interface ShowConfirmActionModal extends Action {
            payload: ShowConfirmActionModalPayload;
        }

        interface ShowCreateContactModalPayload {
            name: string;
            form: string;
        }


        interface ShowCreateContactModal extends Action {
            payload: ShowCreateContactModalPayload;
        }

        interface CloseModalPayload {
            modalName: string;
        }

        interface CloseModal extends Action {
            payload: CloseModalPayload;
        }


        type ShowDeadlineModalPayload = {
            date: string;
            matterId: string;
        } | { deadline: EL.Deadline };

        interface ShowDeadlineModal extends Action {
            payload: ShowDeadlineModalPayload;
        }

        export interface CreateResourceAction extends Action {
            payload: {
                url: string;
                postData: any;
            }
        }

        export interface UpdateResourceAction extends Action {
            payload: {
                url: string;
                data: any;
            };
        }

        export interface DeleteResourceAction extends Action {
            payload: {
                url: string;
            };
        }

        export interface UploadDocumentPayload  {
            files?: File[],
            name: string,
            newDirectory?: string,
            parentId: number;
            url: string;

        }


        export interface UploadDocument extends Action {
            payload: UploadDocumentPayload
        }

        export interface UploadDocumentTreePayload  {
            fileTree: any;
            parentId: number;
            url: string;

        }


        export interface UploadDocumentTree extends Action {
            payload: UploadDocumentTreePayload
        }

        export interface UpdateUploadPayload {
            uploadStatus: DocumentUploadStatus;
            name?: string;
            progress?: number;
        }


        export interface UpdateUpload extends Action {
            payload: UpdateUploadPayload
        }

        export interface UploadCompletePayload {

        }

        export interface UploadComplete extends Action {
            payload: UploadCompletePayload
        }

        interface ICreateNotificationAction extends Action {
            payload: EL.INotification;
        }

        interface IRemoveNotificationAction {
            payload: {
                id: string;
            }
        }

        interface ShowVersionWarningModal extends Action {
            payload: {}
        }
        interface MountedAction extends Action {
            payload: {}
        }

        interface ShowAMLCFTTokenPayload {
            contactId: string;
            token: string;
        }

        interface ShowAMLCFTToken extends Action {
            payload: ShowAMLCFTTokenPayload
        }

        interface ShowUploadPayload {
            uploadType: 'contacts' | 'matters'
        }

        interface ShowUpload extends Action {
            payload: ShowUploadPayload
        }

        interface ShowDocumentModalPayload {
            document: Document
        }

        interface ShowDocumentModal extends Action {
            payload: ShowDocumentModalPayload
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


