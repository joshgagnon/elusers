import * as moment from 'moment';

export function validate(fields: EL.IValidationFields, values: any): EL.ValidationErrors {
    function getFieldErrors(field: EL.IValidationField, value: any) {
        // Required
        let error;
        if (field.required === true) {
            if (!value) {
                error = field.name + ' is required.';
            }
        }

        // Max length
        if (field.maxLength !== undefined) {
            if (!value || value.length > field.maxLength) {
                error = field.name + ' cannot be more than ' + field.maxLength + '.';
            }
        }

        // min value
        if (field.minValue !== undefined) {
            if (!value || value < field.minValue) {
                error =  field.name + ' cannot be less than ' + field.minValue + '.';
            }
        }

        // Is date
        if (value && field.isDate === true) {
            if (!moment(value, ['D MMMM YYYY', 'D MMM YYYY', 'YYYY-MM-DD'], true).isValid()) {
                error =  field.name + ' must be a valid date.';
            }
        }

        // Fields have same value
        if (field.sameAs !== undefined) {
            if (value !== values[field.sameAs.fieldName]) {
                error = `${field.name} must match ${field.sameAs.fieldDisplayName}.`;
            }
        }
        // Fields have same value
        if (field.map !== undefined) {
            error = (value || []).map(value => validate(field.map, value));
        }


        if (field.minItems !== undefined) {
            if (!value || value.length < field.minItems) {
                if(!error){
                    error = [];
                }
                error._error =  "At least " + field.minItems + " " + field.name + " required.";
            }
        }

        return error
    }

    const errors: EL.ValidationErrors = {};

    Object.keys(fields).map(fieldKey => {
        errors[fieldKey] = getFieldErrors(fields[fieldKey], values[fieldKey])
    });

    return errors;
}