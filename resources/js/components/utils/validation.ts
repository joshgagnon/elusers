import * as moment from 'moment';

export function validate(fields: EL.IValidationFields, values: any) {
    function getFieldErrors(field: EL.IValidationField, value: any) {
        // Required
        if (field.required === true) {
            if (!value) {
                return field.name + ' is required.';
            }
        }

        // Max length
        if (field.maxLength !== undefined) {
            if (value.length > field.maxLength) {
                return field.name + ' cannot be more than ' + field.maxLength + '.';
            }
        }

        // min value
        if (field.minValue !== undefined) {
            if (value < field.minValue) {
                return field.name + ' cannot be less than ' + field.minValue + '.';
            }
        }

        // Is date
        if (field.isDate === true) {
            if (!moment(value, 'D MMM YYYY', true).isValid()) {
                return field.name + ' must be a valid date.';
            }
        }

        // Is phone number
        if (field.isPhoneNumber === true) {
            const phoneNumberRegex = /^[0-9]+$/;

            if (!phoneNumberRegex.test(value)) {
                return field.name + ' must be a valid phone number.';
            }
        }

        if (field.isBankAccountNumber === true) {
            const bankAccountNumberRegex = /^[0-9]{16}$/;

            if (!bankAccountNumberRegex.test(value)) {
                return field.name + ' must be a valid bank account number.';
            }
        }

        if (field.isIRDNumber === true) {
            const irdNumberRegex = /^[0-9]{8,9}$/;

            if (!irdNumberRegex.test(value)) {
                return field.name + ' must be a valid IRD number.';
            }
        }

        return undefined;
    }

    let errors = {};

    Object.keys(fields).map(fieldKey => {
        errors[fieldKey] = getFieldErrors(fields[fieldKey], values[fieldKey])
    });

    return errors;
}