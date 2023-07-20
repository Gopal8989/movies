const Joi = require('joi');
const { schemaValueGet } = require('../utils/common.js');
const strongPassword = /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{6,}).*$/;
const commonValidation = {
    id: Joi.string().required(),
    first_name: Joi.string().label('First name').trim().min(2).max(30).required(),
    user_id: Joi.string().label('User id').trim().min(2).max(100).required(),
    last_name: Joi.string().label('Last name').trim().min(2).max(30).required(),
    title: Joi.string().label('Title').trim().min(2).max(100).required(),
    description: Joi.string().label('description').trim().min(2).max(500).required(),
    email: Joi.string().label('Email').trim().email().min(6).max(100).required(),
    password: Joi.string()
        .trim()
        .min(6)
        .max(15)
        .label('Password')
        .regex(strongPassword)
        .messages({
            'string.pattern.base': 'PASSWORD_VALIDATION',
        })
        .required(),
};

const userCreateSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'first_name',
                'last_name',
                'email',
                'password',
            ],
            commonValidation
        )
    ),
};


const userIdSchema = {
    params: Joi.object(
        schemaValueGet(
            [
                'id',
            ],
            commonValidation
        )
    ),
};
const userUpdateDetailSchema = {
    ...userIdSchema,
    body: Joi.object(
        schemaValueGet(
            [
                'first_name',
                'last_name',
                'email',
            ],
            commonValidation
        )
    ),
};

const loginSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'email',
                'password',
            ],
            commonValidation
        )
    ),
}

const tweetCreateSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'title',
                'description',
            ],
            commonValidation
        )
    ),
}
const followerCreateSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'user_id',
            ],
            commonValidation
        )
    ),
};

const tweetUpdateSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'title',
                'description',
            ],
            commonValidation
        )
    ),
    ...userIdSchema
}
module.exports = {
    userCreateSchema,
    userIdSchema,
    userUpdateDetailSchema,
    loginSchema,
    tweetCreateSchema,
    followerCreateSchema,
    tweetUpdateSchema
};
