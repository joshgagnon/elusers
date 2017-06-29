declare namespace EvolutionUsers {
    interface IUser {
        title: string;
        firstName: string;
        middleName?: string;
        lastName: string;
        preferredName?: string;
        email: string;
    }

    export interface IState {
        routing: any;
        user: IUser;
        something: boolean;
    }

    export interface IAction {
        type: string;
        payload?: any;
    }
}