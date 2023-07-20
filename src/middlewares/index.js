const validateMiddleware = require('./validate.js');
const authMiddleware = require('./auth.js')
module.exports = {
    validateMiddleware,
    authMiddleware
};
