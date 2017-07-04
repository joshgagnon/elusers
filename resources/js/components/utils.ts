// Infer the users full name
export function fullname(user: EvolutionUsers.IUser) {
    return user.title // title
        + ' ' + user.firstName // first name
        + ( user.middleName ? ' ' + user.middleName : '' ) // middle name
        + ' ' + user.surname; // last name
}

export function minutesToHours(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = (minutes % 60) + '';
    const remainingMinutesString = remainingMinutes.length === 1 ? '0' + remainingMinutes : remainingMinutes;

    return hours + ':' + remainingMinutesString;
}