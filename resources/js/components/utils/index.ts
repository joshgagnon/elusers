import * as moment from 'moment';

export const DATE_FORMAT = 'D MMM YYYY';

// Infer the users full name
export function fullname(user: EL.User | EL.Contact) {
    if(!('contactable' in user)){
         return [user.title, user.firstName, user.middleName, user.surname].filter(x => !!x).join(' ');
    }
    else if(user.contactableType === EL.Constants.INDIVIDUAL){
        const contactable = user.contactable as EL.ContactIndividual;
        return [contactable.title, contactable.firstName, contactable.middleName, contactable.surname].filter(x => !!x).join(' ');
    }
    return user.name || '\xa0';
}

export function name(user: EL.User) {
    return user.preferredName || user.firstName;
}

export function guessName(user: EL.User | EL.Contact) {
    return (<EL.User>user).preferredName ? name(user as EL.User) : fullname(user)
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
    return moment(date).format(DATE_FORMAT)
}

export function getAddressSegments(address: EL.IAddress): string[] {
    const lineKeys = ['addressOne', 'addressTwo', 'city', 'county', 'state', 'postCode', 'country'];
    return lineKeys.map((key: string) => address[key]).filter((value: string) => !!value);
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