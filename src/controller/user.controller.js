
const { ObjectId } = require("mongodb");
const utility = require('../utils/common.js');
const userModel = require('../models/user.js');
const { statusCode } = require('../constant/status-code.js');

module.exports.userLogin = async (req, res, next) => {
    try {
        const emailResult = await userModel.checkEmail(req);
        if (emailResult) {
            const result = await userModel.userLogin(req, emailResult)
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
        const emailResult = await userModel.userLogout(req);
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
        const emailResult = await userModel.checkEmail(req);
        if (emailResult) {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'EMAIL_EXIST'),
                data: null
            })
        } else {
            const result = await userModel.userCreate(req)
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
        const result = await userModel.userList(req)
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
        const result = await userModel.userUpdate(req)
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


module.exports.tweetGet = async (req, res, next) => {
    try {
        const result = await userModel.tweetGet(req)
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


module.exports.tweetCreate = async (req, res, next) => {
    try {
        const result = await userModel.tweetCreate(req);
        if (result) {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
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

module.exports.tweetUpdate = async (req, res, next) => {
    try {
        const result = await userModel.tweetUpdate(req)
        if (result) {
            res.status(statusCode.OK).json({
                success: true,
                message: utility.getMessage(req, false, 'TWEET_UPDATED'),
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

module.exports.tweetList = async (req, res, next) => {
    try {
        const result = await userModel.tweetList(req)
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

module.exports.tweetDelete = async (req, res, next) => {
    try {
        const result = await userModel.tweetDelete(req)
        if (result) {
            res.status(statusCode.OK).json({
                success: true,
                message: utility.getMessage(req, false, 'TWEET_DELETED'),
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


module.exports.followUser = async (req, res, next) => {
    try {
        const query = {
            _id: new ObjectId(req?.body?.user_id),
        }
        // Campare user same id
        if (String(req?.body?.user_id) == String(req?.user?._id)) {
            res.status(statusCode.BAD_REQUEST).json({
                success: false,
                message: utility.getMessage(req, false, 'SAMEUSER_NOT_EXIST'),
                data: null
            })
        } else {
            const emailResult = await userModel.checkUserDetails(query);
            if (emailResult) {
                const result = await userModel.followUser(req);
                if (result) {
                    res.status(statusCode.BAD_REQUEST).json({
                        success: false,
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
                    message: utility.getMessage(req, false, 'USER_NOT_EXIST'),
                    data: null
                })
            }
        }
    }
    catch (error) {
        next(error)
    };
};


module.exports.followUserGet = async (req, res, next) => {
    try {
        const result = await userModel.followUserGet(req)
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