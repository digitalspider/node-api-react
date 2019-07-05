const message = require('./message');
const {ValidationError} = require('./../libs/APIError');
const sequelizePlaceholder = 'sequelize';
const _ = require('lodash');

class Validator {
  // Format the validations returned by sequelize validation
  formatValidationErrors(errors) {
    let warningRegex = RegExp('^Warning*');
    let validationErrors = this.extractSequelizeErrors(errors);
    return validationErrors.filter(
      (error) => !warningRegex.test(error.message)
    );
  }

  // Format any errors returned by sequelize (Generally used to format
  // 500 errors)
  // @params: Object error -> sequelize error object
  formatSequelizeErrors(error) {
    let validationErrors = [];
    if (error.errors) {
      validationErrors = this.extractSequelizeErrors(error.errors);
    } else if (error.message) {
      validationErrors.push(error.message);
    } else {
      validationErrors.push(error.toString());
    }
    return validationErrors;
  }

  // Extract validation error messages from an array of errors
  extractSequelizeErrors(errors) {
    let validationErrors = [];
    for (let i in errors) {
      if (validationErrors.indexOf(errors[i].message) === -1) {
        validationErrors.push(errors[i].message);
      }
    }
    return validationErrors;
  }

  // Verifies wheter an error comes from sequelize or not
  isSequelizeError(errorName) {
    if (errorName) {
      return errorName.toLowerCase().indexOf(sequelizePlaceholder) !== -1;
    }
    return false;
  }

  // Validate alphanumeric values with spaces
  isAlphaNumericWithSymbols(field, value) {
    if (!this.verifyAlphaNumericWithSymbols(value)) {
      throw new Error(
        message.getAndReplace('FIELD_ALPHANUMERIC_SYMBOLS', field)
      );
    }
  }

  // Validate alphanumeric values with spaces
  isAlphaNumericWithSpaces(field, value) {
    if (!this.verifyAlphaNumericWithSpaces(value)) {
      throw new Error(
        message.getAndReplace('FIELD_ALPHANUMERIC_SPACES', field)
      );
    }
  }

  // Validate s3 Key
  isS3Key(field, value) {
    if (!this.verifyS3Key(value)) {
      throw new Error(
        message.getAndReplace('FIELD_S3_KEY', field)
      );
    }
  }

  // Validate boolean values
  isBoolean(field, value) {
    if (!this.verifyBoolean(value)) {
      throw new Error(message.getAndReplace('FIELD_BOOLEAN', field));
    }
  }

  // Validate phone number values
  isPhoneNumber(field, value) {
    if (!this.verifyPhoneNumber(value)) {
      throw new Error(message.getAndReplace('FIELD_PHONENUMBER', field));
    }
  }

  /**
   * Checks whether given parameter is an empty/blank string
   * @param {String} value
   * @return {Boolean} true if parameter is empty/blank
   */
  verifyEmptyString(value) {
    return !value.replace(/\s/g, '').length;
  }
  // Verify whether a value is in phone number format or not
  verifyPhoneNumber(value) {
    let regex = RegExp('^[0-9-+()]*$');
    return regex.test(value);
  }

  // Verify whether a value is alphanumeric with symbols or not
  verifyAlphaNumericWithSymbols(value) {
    let regex = /^[a-zA-Z0-9 _./|!@#$%^&*()=+\\\-]*$/g;
    return regex.test(value);
  }

  // Verify whether a value is alphanumeric with spaces or not
  verifyAlphaNumericWithSpaces(value) {
    let regex = RegExp('^[a-zA-Z0-9 ]*$');
    return regex.test(value);
  }

  // Verify whether a value is a valid s3Key or not
  verifyS3Key(value) {
    let regex = RegExp('^[a-zA-Z0-9 \-\'\/!_.*()]*$');
    return regex.test(value);
  }

  // Verify whether a value is boolean or not
  verifyBoolean(value) {
    let validatonValues = [true, false, 1, 0, 'true', 'false', '1', '0'];
    return validatonValues.indexOf(value) !== -1;
  }

  // Verify whether a value is numeric or not
  verifyNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  // Validates an array field. An array field is considered a field which value
  // is an array of integer values
  validateArrayField(fieldName, value) {
    // Validate type
    if (!Array.isArray(value)) {
      throw new ValidationError(
        message.getAndReplace('INVALID_ARRAY_FIELD', fieldName)
      );
    }

    // Verify that values in the array are integer
    for (let i in value) {
      if (!Number.isInteger(value[i])) {
        throw new ValidationError(
          message.getAndReplace('FIELD_ARRAY_NUMERIC', fieldName)
        );
      }
    }
  }

  // Verify whether a value matches a valid email, with a given extension
  verifyEmailWithExtension(value, extension) {
    let regex = RegExp(
      [
        '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+',
        _.escapeRegExp(extension),
        '$',
      ].join('')
    );
    return regex.test(value);
  }
}

module.exports = new Validator();
