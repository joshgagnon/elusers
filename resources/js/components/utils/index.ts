import * as moment from 'moment';

// Infer the users full name
export function fullname(user: EL.User) {
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
    return seperateValues.hours + ':' + seperateValues.minutes.toString().padStart(2, '0');
}

export function formatDate(date: string) {
    return moment(date).format('D MMM YYYY')
}

export function getAddressSegments(address: EL.IAddress): string[] {
    const lineKeys = ['addressOne', 'addressTwo', 'addressThree', 'postCode', 'countryCode'];

    return lineKeys.reduce((lines: string[], nextKey: string) => {
        if (address[nextKey]) {
            return [...lines, address[nextKey]];
        }

        return lines;
    }, [])
}

export function formatAddress(address: EL.IAddress): string {
    const addressSegments = getAddressSegments(address);
    let formattedAddress = '';
    
    for (let index = 0; index < addressSegments.length; index++) {
        formattedAddress += addressSegments[index];

        // add ', ' to the end of all segments except the last
        if (index !== addressSegments.length - 1) {
            formattedAddress += ', ';
        }
    }

    return formattedAddress;
}