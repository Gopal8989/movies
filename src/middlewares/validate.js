const Joi = require('joi');
const utils = require('../utils/common.js');
const { statusCode } = require('../constant/status-code.js');

/**
 * Middleware for validate json object schema request
 * @param {Object} schema
 * @returns {function}
 */
const validate = (schema) => async (req, res, next) => {
    try {
        const validSchema = utils.pick(schema, [
            'headers',
            'params',
            'query',
            'body',
        ]);

        const object = utils.pick(req, Object.keys(validSchema));

        let { error } = Joi.compile(validSchema)
            .prefs({ errors: { label: 'key' }, abortEarly: false })
            .validate(object);
        if (error) {
            const errors = [];
            error.details.forEach((errorData) => {
                const errorMessage = utils.getMessage(req, false, errorData.message);
                const errorObject = {
                    message: errorMessage,
                    field: errorData.path.join('_'),
                    type: errorData.type,
                };

                errors.push(errorObject);
            });
            error = [errors[0]];
            error.status = statusCode.BAD_REQUEST;
            error.message = errors[0]?.message;
            next(error);
            // return next(new ValidationError('Validation error'));
        } else {
            return next();
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = validate;
