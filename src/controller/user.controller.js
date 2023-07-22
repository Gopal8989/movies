

const bcrypt = require('bcryptjs');
const utility = require('../utils/common.js');
const userRepository = require('../repositories/user.repository.js');
const { statusCode } = require('../constant/status-code.js');
const config = require('../config/index.js')
const { sendGridEmail } = require('../service/sendgrid.service.js')
const { generateRandomString } = require('../utils/common.js')
module.exports.userLogin = async (req, res, next) => {
    try {
        const emailResult = await userRepository.userdetails(req);
        if (emailResult && !emailResult?.isEmailVerify) {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'EMAIL_NOT_VERFIRY'),
                data: null
            })
        } else
            if (emailResult) {
                const result = await userRepository.userLogin(req, emailResult)
                if (result) {
                    res.status(statusCode.OK).json({
                        success: true,
                        message: utility.getMessage(req, false, 'LOGIN_SUCCESS'),
                        data: { token: result }
                    })
                } else {
                    res.status(statusCode.BAD_REQUEST).json({
                        success: false,
                        message: utility.getMessage(req, false, 'WRONG_CREDENTIAL'),
                        data: null
                    })
                }
            } else {
                res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: utility.getMessage(req, false, 'WRONG_CREDENTIAL'),
                    data: null
                })
            }
    }
    catch (error) {
        next(error)
    };
};


module.exports.userLogout = async (req, res, next) => {
    try {
        req.body.token = null;
        const emailResult = await userRepository.userUpdate(req);
        if (emailResult) {
            res.status(statusCode.OK).json({
                success: true,
                message: utility.getMessage(req, false, 'LOGOUT_SUCCESS'),
                data: {}
            })
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'WRONG_CREDENTIAL'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};

module.exports.userCreate = async (req, res, next) => {
    try {
        const emailResult = await userRepository.userdetails(req);
        if (emailResult) {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'EMAIL_EXIST'),
                data: null
            })
        } else {
            const result = await userRepository.userCreate(req)
            if (result) {
                res.status(statusCode.OK).json({
                    success: true,
                    message: utility.getMessage(req, false, 'USER_CREATED'),
                    data: result
                })
            } else {
                res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                    data: null
                })
            }
        }
    }
    catch (error) {
        next(error)
    };
};

module.exports.userList = async (req, res, next) => {
    try {
        const result = await userRepository.userList(req)
        if (result) {
            res.status(statusCode.OK).json({
                success: true,
                data: result
            })
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                data: nulls
            })
        }
    }
    catch (error) {
        next(error)
    };
};

module.exports.userLoginLogList = async (req, res, next) => {
    try {
        const result = await userRepository.userLoginLogList(req)
        if (result) {
            res.status(statusCode.OK).json({
                success: true,
                data: result
            })
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                data: nulls
            })
        }
    }
    catch (error) {
        next(error)
    };
};


module.exports.userDetails = async (req, res, next) => {
    try {
        const result = req?.user;
        if (result) {
            delete result.token;
            delete result.password;
            res.status(statusCode.OK).json({
                success: true,
                message: utility.getMessage(req, false, 'USER_DETAILS'),
                data: result
            })
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};

module.exports.updateUser = async (req, res, next) => {
    try {
        const result = await userRepository.userUpdate(req)
        if (result) {
            res.status(statusCode.OK).json({
                success: true,
                message: utility.getMessage(req, false, 'USER_UPDATED'),
                data: result
            })
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};

module.exports.emailVerify = async (req, res, next) => {
    try {
        const userResult = await userRepository.userdetails(req);
        if (userResult) {
            req.body.isEmailVerify = true;
            req.body.resetToken = null
            req.userResult = userResult?.dataValues;
            const result = await userRepository.userUpdate(req)
            if (result) {
                res.status(statusCode.OK).json({
                    success: true,
                    message: utility.getMessage(req, false, 'EMAIL_VERIFY'),
                    data: {}
                })
            } else {
                res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                    data: null
                })
            }
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'LINK_EXPIRE'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};

module.exports.resetPasswordLink = async (req, res, next) => {
    try {
        const userResult = await userRepository.userdetails(req);
        if (userResult) {
            req.body.resetToken = generateRandomString(6)
            req.userResult = userResult?.dataValues;
            const result = await userRepository.userUpdate(req)
            if (result) {
                sendGridEmail({
                    message: `<html>
                <head>
                  <title>Please reset password</title>
                </head>
                
                <body>
                <p>Hello dear,</p>
                  <h1>Your password link expire 1 hours</h1>
                  <a href='${config?.app?.baseUrl}change/password/${req.body.resetToken}'>Click here</a>
                </body>        
                </html>`, subject: 'Reset password', to: userResult?.email
                });
                res.status(statusCode.OK).json({
                    success: true,
                    message: utility.getMessage(req, false, 'RESET_LINK_SENT'),
                    data: {}
                })
            } else {
                res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                    data: null
                })
            }
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'ACCOUNT_NOTEXIST'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};

module.exports.resetPassword = async (req, res, next) => {
    try {
        const userResult = await userRepository.userdetails(req);
        if (userResult) {
            const salt = await bcrypt.genSalt();
            req.body.password = await bcrypt.hash(req?.body?.password, salt);
            const result = await userRepository.userUpdate(req)
            if (result) {
                res.status(statusCode.OK).json({
                    success: true,
                    message: utility.getMessage(req, false, 'PASSWORD_UPDATED'),
                    data: {}
                })
            } else {
                res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                    data: null
                })
            }
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'LINK_EXPIRE'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};

module.exports.moviesGet = async (req, res, next) => {
    try {
        const result = await userRepository.moviesGet(req)
        if (result) {
            res.status(statusCode.OK).json({
                success: true,
                data: result
            })
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};


module.exports.moviesCreate = async (req, res, next) => {
    try {
        const result = await userRepository.moviesCreate(req);
        if (result) {
            res.status(statusCode.OK).json({
                success: false,
                message: utility.getMessage(req, false, 'MOVIE_CREATED'),
                data: result
            })
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};

module.exports.moviesUpdate = async (req, res, next) => {
    try {
        const movieResult = await userRepository.moviesGet(req);
        if (movieResult) {
            req.movieData = movieResult?.dataValues;
            const result = await userRepository.moviesUpdate(req)
            if (result) {
                res.status(statusCode.OK).json({
                    success: true,
                    message: utility.getMessage(req, false, 'MOVIE_UPDATED'),
                    data: result
                })
            } else {
                res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                    data: null
                })
            }
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'MOVIES_NOT_EXIST'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};


module.exports.uploadMediaForMovies = async (req, res, next) => {
    try {
        const movieResult = req?.file;
        if (movieResult) {
            res.status(statusCode.OK).json({
                success: true,
                data: movieResult
            })
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'MOVIES_NOT_EXIST'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};


module.exports.moviesList = async (req, res, next) => {
    try {
        const result = await userRepository.moviesList(req)
        if (result) {
            res.status(statusCode.OK).json({
                success: true,
                data: result
            })
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                data: nulls
            })
        }
    }
    catch (error) {
        next(error)
    };
};

module.exports.moviesDelete = async (req, res, next) => {
    try {
        const movieResult = await userRepository.moviesGet(req);
        if (movieResult) {

            req.movieData = movieResult?.dataValues;
            const result = await userRepository.moviesDelete(req)
            if (result) {
                res.status(statusCode.OK).json({
                    success: true,
                    message: utility.getMessage(req, false, 'MOVIE_DELETED'),
                    data: result
                })
            } else {
                res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: utility.getMessage(req, false, 'FALSE_RESPONSE'),
                    data: null
                })
            }
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'MOVIES_NOT_EXIST'),
                data: null
            })
        }

    }
    catch (error) {
        next(error)
    };
};


module.exports.moviesRating = async (req, res, next) => {
    try {
        const result = await userRepository.moviesGet(req);
        if (result) {
            const result = await userRepository.moviesRating(req);
            if (result) {
                res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    data: result,
                    message: utility.getMessage(req, false, 'RATING_SENT'),

                })
            } else {
                res.status(statusCode.BAD_REQUEST).json({
                    success: false,
                    message: utility.getMessage(req, false, 'RATING_EXIST'),
                    data: null
                })
            }
        } else {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'MOVIES_NOT_EXIST'),
                data: null
            })
        }
    }
    catch (error) {
        next(error)
    };
};

