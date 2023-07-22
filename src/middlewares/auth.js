const jwt = require('../service/jwt.service.js');
const userRepository = require('../repositories/user.repository.js');
const utility = require('../utils/common.js');
const { statusCode } = require('../constant/status-code.js');
/**
 * Check user authorization
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const authValidateRequest = async (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            const unauthorizedError = statusCode.UNAUTHORIZED;
            if (parts.length === 2) {
                const scheme = parts[0];
                const token = parts[1];
                if (/^Bearer$/i.test(scheme)) {
                    console.log(token)
                    const decodedToken = jwt.verifyToken(token);
                    console.log(decodedToken)
                    if (decodedToken) {

                        const query = { id: decodedToken?.id, token: token }
                        const userResult = await userRepository.checkUserdetails(query);
                        if (userResult) {
                            req.user = userResult;
                            next();
                        } else {
                            const error = new Error();
                            error.status = unauthorizedError;
                            error.message = utility.getMessage(
                                req,
                                false,
                                'ACCOUNT_INACTIVE'
                            );
                            next(error);
                        }
                    } else {

                        console.log('hsssssssssss213333333333333331sss12111111111111111111111sssdbjdsd')
                        const error = new Error('TOKEN_NOT_FOUND');
                        error.status = statusCode.BAD_REQUEST;;
                        error.message = utility.getMessage(
                            req,
                            false,
                            'UNAUTHORIZED_USER_ACCESS'
                        );
                        next(error);
                    }
                } else {

                    console.log('hssssssssssssss12111111111111111111111sssdbjdsd')
                    const error = new Error('TOKEN_BAD_FORMAT');
                    error.status = unauthorizedError;
                    error.message = utility.getMessage(req, false, 'SESSION_EXPIRE'); // 'Format is Authorization: Bearer [token]';
                    next(error);
                }
            } else {

                console.log('hssssssssssssssssdbjdsd')
                const error = new Error('TOKEN_BAD_FORMAT');
                error.status = unauthorizedError; // HttpStatus['401'];
                error.message = utility.getMessage(
                    req,
                    false,
                    'UNAUTHORIZED_USER_ACCESS'
                ); // 'Format is Authorization: Bearer [token]';
                next(error);
            }
        } else {
            console.log('hdbjdsd')
            const error = new Error('TOKEN_NOT_FOUND');
            error.status = statusCode.UNAUTHORIZED;;
            error.message = utility.getMessage(
                req,
                false,
                'UNAUTHORIZED_USER_ACCESS'
            );
            next(error);
        }
    } catch (e) {
        console.log(e)
        const error = new Error('TOKEN_NOT_FOUND');
        error.status = statusCode.UNAUTHORIZED;;
        error.message = utility.getMessage(req, false, 'SESSION_EXPIRE'); // 'Format is Authorization: Bearer [token]';
        next(error);
    }
};
module.exports = authValidateRequest;
