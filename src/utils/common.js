const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
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

exports.generateRandomString = (length) => {
    try {
        let chars = 'klmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        chars = `${chars}0123456789abcdefghij`;
        let output = '';

        for (let x = 0; x < length; x += 1) {
            const i = Math.floor(Math.random() * 62);
            output += chars.charAt(i);
        }
        return output;
    } catch (error) {
        throw new Error(error);
    }
};


exports.getImage = (str, defaultIcon, type, thumbImage = null) => {
    try {
        // type = type ?? 'private';
        if (str) {
            const imagePathArray = str.split('/');
            const imageName = imagePathArray.pop();
            let thumbPath = path.parse(imageName);
            (thumbPath = `${thumbPath.dir}/thumb/${thumbPath.base}`),
                imagePathArray.push(thumbImage ? thumbPath : imageName);


            if (this.isFileExist(str)) {
                return `${this.getEnv(
                    'BASE_URL'
                )}/${imagePathArray.join('/')}`;
            }
            return defaultIcon;
        }
        return defaultIcon;
    } catch (error) {
        throw new Error(error);
    }
};

exports.isFileExist = (filePath) => {
    try {
        const tmpPath = path.join(path.resolve(), `${filePath}`);
        return fs.existsSync(tmpPath) || false;
    } catch (error) {
        throw new Error(error);
    }
};