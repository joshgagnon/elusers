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
        if (value && field.isDate === true) {
            if (!moment(value, 'D MMM YYYY', true).isValid()) {
                return field.name + ' must be a valid date.';
            }
        }

        // Fields have same value
        if (field.sameAs !== undefined) {
            if (value !== values[field.sameAs.fieldName]) {
                return `${field.name} must match ${field.sameAs.fieldDisplayName}.`;
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