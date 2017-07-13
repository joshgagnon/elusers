import * as leftPad from 'left-pad';

// Infer the users full name
export function fullname(user: EvolutionUsers.IUser) {
    return user.title // title
        + ' ' + user.firstName // first name
        + ( user.middleName ? ' ' + user.middleName : '' ) // middle name
        + ' ' + user.surname; // last name
}

export function minutesToHoursAndMinutes(minutes: number): { hours: number; minutes: number } {
    return {
        hours: Math.floor(minutes / 60),
        minutes: minutes % 60
    };
}

export function minutesToFractionalHours(minutes: number): number {
    return minutes / 60;
}

export function fractionalHoursToMinutes(fractionalHours: number): number {
    return fractionalHours * 60;
}

export function minutesToHoursString(minutes: number) {
    const seperateValues = minutesToHoursAndMinutes(minutes);
    return seperateValues.hours + ':' + leftPad(seperateValues.minutes, 2, 0);
}