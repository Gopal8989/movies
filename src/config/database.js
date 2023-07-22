const utils = require('../utils/common.js');

module.exports = {
    host: utils.getEnv('DB_HOST'),
    port: utils.getEnv('DB_PORT'),
    username: utils.getEnv('DB_USER'),
    password: utils.getEnv('DB_PASSWORD'),
    db: utils.getEnv('DB_NAME'),
    timezone: '+00:00',
    dialect: 'mysql',
};
