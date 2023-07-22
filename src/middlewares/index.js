const validateMiddleware = require('./validate.js');
const authMiddleware = require('./auth.js')
const authriztaionMiddleware = require('./resource-access.middleware.js')
const mediaMiddleware = require('./media-upload.js')
module.exports = {
    validateMiddleware,
    authMiddleware,
    authriztaionMiddleware,
    mediaMiddleware
};
