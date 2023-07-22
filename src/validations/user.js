const Joi = require('joi');
const { schemaValueGet } = require('../utils/common.js');
const strongPassword = /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{6,}).*$/;
const commonValidation = {
    id: Joi.string().required(),
    director: Joi.string().label('Director').trim().min(2).max(30).required(),
    duration: Joi.number().integer().required(),
    genere: Joi.string().label('Genere').trim().min(2).max(30).required(),
    type: Joi.string().valid('movie', 'series').required(),
    coverImage: Joi.string().label('Cover Image').trim().min(2).max(500).optional().empty().allow(null),
    file: Joi.string().label('File').trim().min(2).max(500).required(),
    year: Joi.string().trim().regex(/^[0-9]/).length(4).required(),
    firstName: Joi.string().label('First name').trim().min(2).max(30).required(),
    userId: Joi.string().label('User id').trim().min(2).max(100).required(),
    lastName: Joi.string().label('Last name').trim().min(2).max(30).required(),
    userType: Joi.string().valid('user', 'admin').required(),
    title: Joi.string().label('Title').trim().min(2).max(100).required(),
    description: Joi.string().label('description').trim().min(2).max(500).required(),
    email: Joi.string().label('Email').trim().email().min(6).max(100).required(),
    rating: Joi.number().greater(0).less(6).required(),
    token: Joi.string().trim().length(6).required(),
    review: Joi.string().label('Review').trim().min(2).max(500).optional().empty().allow(null),
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
                'firstName',
                'lastName',
                'email',
                'password',
                'userType'
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
                'firstName',
                'lastName',
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

const moviesCreateSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'title',
                'description',
                'year',
                'director',
                'duration',
                'genere',
                'type',
                'coverImage',
                'file'
            ],
            commonValidation
        )
    ),
}
const ratingCreateSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'rating',
                'review'
            ],
            commonValidation
        )
    ),
    ...userIdSchema
};

const moviesUpdateSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'title',
                'description',
                'year',
                'director',
                'duration',
                'genere',
                'type',
                'coverImage',
                'file'
            ],
            commonValidation
        )
    ),
    ...userIdSchema
}

const mediaCreateSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'file',
            ],
            commonValidation
        )
    ),
}

const resetPasswordSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'email',
            ],
            commonValidation
        )
    ),
}
const emailVerifySchema = {
    params: Joi.object(
        schemaValueGet(
            [
                'token',
            ],
            commonValidation
        )
    ),
}

const changePasswordSchema = {
    ...emailVerifySchema,
    body: Joi.object(
        schemaValueGet(
            [
                'password',
            ],
            commonValidation
        )
    ),
}
module.exports = {
    userCreateSchema,
    userIdSchema,
    userUpdateDetailSchema,
    loginSchema,
    moviesCreateSchema,
    ratingCreateSchema,
    moviesUpdateSchema,
    mediaCreateSchema,
    resetPasswordSchema,
    emailVerifySchema,
    changePasswordSchema
};
