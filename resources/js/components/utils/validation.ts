interface validationFields {
    name: string;
    required?: boolean;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    isDate?: boolean;
    isPhoneNumber?: boolean;
}

export function validate(fields: validationFields[], values) {
    function getFieldErrors(field, value) {
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
                return field.name + ' must be a phone number.';
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