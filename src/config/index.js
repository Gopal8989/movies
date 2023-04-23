const path = require('path');
const utils = require('../utils/common.js');

module.exports = {
    app: {
        port: utils.getEnv('PORT'),
        baseUrl: utils.getEnv('BASE_URL'),
        siteName: utils.getEnv('APP_NAME'),
    },
    db: {
        dbUrl: utils.getEnv('DB_URL'),
    },
    jwtSecret: utils.getEnv('JWT_SECRET'),
    jwtExpireIn: utils.getEnv('JWT_EXPIRE_IN'),
};
