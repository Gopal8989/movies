const Joi = require('joi');
const { schemaValueGet } = require('../utils/common.js');

const commonValidation = {
    id: Joi.string().required(),
    first_name: Joi.string().label('First name').trim().min(2).max(30).required(),
    department: Joi.string().label('Department name').trim().min(2).max(30).required(),
    last_name: Joi.string().label('Last name').trim().min(2).max(30).required(),
    email: Joi.string().label('Email').trim().email().min(6).max(100).required(),
    city: Joi.string().label('City Name').trim().min(2).max(20).required(),
};

const userCreateSchema = {
    body: Joi.object(
        schemaValueGet(
            [
                'first_name',
                'last_name',
                'email',
                'department',
                'city',
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
    ...userCreateSchema
};


module.exports = {
    userCreateSchema,
    userIdSchema,
    userUpdateDetailSchema
};
