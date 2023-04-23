const utility = require('../utils/common.js');
const userModel = require('../models/employee.js');
const { statusCode } = require('../constant/status-code.js');

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
        const result = await userModel.userDetails(req)
        if (result) {
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

module.exports.userDelete = async (req, res, next) => {
    try {
        const result = await userModel.deleteUser(req)
        if (result) {
            res.status(statusCode.OK).json({
                success: true,
                message: utility.getMessage(req, false, 'USER_DELETED'),
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