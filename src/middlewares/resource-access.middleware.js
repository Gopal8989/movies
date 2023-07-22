const utility = require('../utils/common.js');
const { statusCode } = require('../constant/status-code.js');

/**
 * Check resource access permission
 * according to user role
 * @param {Array} userTypeArr
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const resourceAccessGuard = (userTypeArr) => async (req, res, next) => {
    const {
        user: {
            userType,
        },
    } = req;
    try {
        if (~userTypeArr.indexOf(req?.user?.userType ?? userType)) {
            next();
        } else {
            const error = new Error('INVALID_USER_ACCESS');
            error.status = statusCode.FORBIDDEN;
            error.message = `Resource can not be accessed by ${userType ?? ''}`;
            next(error);
        }
    } catch (error) {
        error.status = statusCode.UNAUTHORIZED;
        next(error);
    }
};

module.exports = resourceAccessGuard;
