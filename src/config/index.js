const utils = require('../utils/common.js');

module.exports = {
    app: {
        port: utils.getEnv('PORT'),
        baseUrl: utils.getEnv('BASE_URL'),
        siteName: utils.getEnv('APP_NAME'),
    },
    jwtSecret: utils.getEnv('JWT_SECRET'),
    jwtExpireIn: utils.getEnv('JWT_EXPIRE_IN'),

    sendGrid: {
        skdSendGrid: utils.getEnv('SEND_GRID_SKD'),
        email: utils.getEnv('SEND_GRID_FROM_EMAIL'),
    },
};
