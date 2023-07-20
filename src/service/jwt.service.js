const jwt = require('jsonwebtoken');
const config = require('../config/index.js');

module.exports = {
    async createToken(payload) {
        return jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.jwtExpireIn,
        });
    },

    verifyToken(token) {
        return jwt.verify(token, config.jwtSecret, {
            expiresIn: config.jwtExpireIn,
        });
    },

    decodeToken(token) {
        return jwt.decode(token, {
            complete: true,
        });
    },
};
