declare namespace EvolutionUsers {
    interface User {
        title: string;
        firstName: string;
        middleName?: string;
        lastName: string;
        preferredName?: string;
        email: string;
    }

    export interface State {
        user: User;
    }
}