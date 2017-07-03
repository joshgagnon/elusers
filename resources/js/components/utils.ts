// Infer the users full name
export function fullname(user: EvolutionUsers.IUser) {
    return user.title // title
        + ' ' + user.firstName // first name
        + ( user.middleName ? ' ' + user.middleName : '' ) // middle name
        + ' ' + user.surname; // last name
}