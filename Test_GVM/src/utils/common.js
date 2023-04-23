const dotenv = require('dotenv');
const language = require('../language/index.js');
dotenv.config();

/**
 * Get environment variable value
 * @param {string} envVar
 * @returns {any}
 */
exports.getEnv = (envVar) => {
    try {
        const envValue = process.env[envVar];
        if (envValue) {
            return envValue;
        }
        return null;
    } catch (error) {
        throw new Error(error);
    }
};


exports.getMessage = (req, data, key) => {
    try {
        let languageCode = req.headers && req.headers.language;
        languageCode = languageCode || 'en';
        const condition = language[languageCode] && language.en[`${key}`];
        if (data) {
            return condition ? language[languageCode][`${key}`](data) : key;
        }
        return condition ? language[languageCode][`${key}`] : key;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports.schemaValueGet = (value, schema) => {
    try {
        const final = [];
        value.forEach((e) => final.push({ [e]: schema[e] }));
        return Object.assign(...final);
    } catch (error) {
        throw new Error(error);
    }
};


/**
 * Creates an object composed of the picked object properties
 * @param {object} object
 * @param {array} keys
 * @returns {object}
 */
exports.pick = (object, keys) => {
    try {
        return keys.reduce((obj, key) => {
            if (object && Object.prototype.hasOwnProperty.call(object, key)) {
                // eslint-disable-next-line no-param-reassign
                obj[key] = object[key];
            }
            return obj;
        }, {});
    } catch (error) {
        throw new Error(error);
    }
};
