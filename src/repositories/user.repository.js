const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('../config/index.js')
const models = require('../models/index.js');
const jwt = require('../service/jwt.service.js');
const { userType } = require('../constant/enum.js')
const { generateRandomString } = require('../utils/common.js')
const { sendGridEmail } = require('../service/sendgrid.service.js')
const {
    User,
    UserLoginLog,
    Movie,
    MovieLog,
    MovieRating
} = models;
/**
 * Create Admin and user
 * @param {object} req
 * @returns
 */
module.exports.userCreate = async (req) => {
    try {
        const {
            body,
        } = req;
        const { password } = body;
        const salt = await bcrypt.genSalt();
        body.password = await bcrypt.hash(password, salt);
        const result = await User.create({ ...body, resetToken: generateRandomString(6) });
        sendGridEmail({
            message: `<html>
        <head>
          <title>Email is verify</title>
        </head>
        
        <body>
          <h1>Your account is verify</h1>
          <a href='${config?.app?.baseUrl}email-veriry/${result?.resetToken}'>Click here</a>
        </body>        
        </html>`, subject: 'Email verify', to: body?.email
        });
        return result;
    } catch (error) {
        throw Error(error);
    }
};

/**
 * Update Admin and user
 * @param {object} req
 * @returns
 */
module.exports.userUpdate = async (req) => {
    try {
        const {
            body, user, params: { id }, userResult
        } = req;
        const where = {};
        if (id) {
            where.id = id;
        }
        if (userResult?.id) {
            where.id = userResult?.id
        }
        return await User.update({ ...body, updateById: userResult?.id ?? user?.id }, { where });
    } catch (error) {
        throw Error(error);
    }
};
/**
 * user login
 * @param {object} req
 * @returns
 */
module.exports.userLogin = async (req, userResult) => {
    const transaction = await models.sequelize.transaction();
    try {
        const {
            body: { password },
        } = req;
        console.log(userResult?.password, password)
        const isPasswordMatch = await bcrypt.compare(password, userResult?.password);
        if (isPasswordMatch) {
            const token = await jwt.createToken(userResult?.dataValues);
            await User.update({ token }, { where: { id: userResult?.id } }, { transaction });
            await UserLoginLog.create({ userId: userResult?.id, ipV4: req?.socket?._peername?.address, ipV6: req?.socket?._peername?.address }, { transaction });
            await transaction.commit();
            return token;
        }
        return false;
    } catch (error) {

        await transaction.rollback();
        throw Error(error);
    }
};

/**
* Get user details
* @param {object} req
* @returns
*/
module.exports.userdetails = async (req) => {
    try {
        const {
            body, params
        } = req;
        const where = {};
        if (params?.id) {
            where.id = params?.id;
        }
        if (body?.email) {
            where.email = body?.email;
        }
        if (params?.token) {
            where.resetToken = params?.token;
        }

        return await User.findOne({ where });
    } catch (error) {
        throw Error(error);
    }
};


/**
* check user details
* @param {object} req
* @returns
*/
module.exports.checkUserdetails = async (where) => {
    try {
        return await User.findOne({ where });
    } catch (error) {
        throw Error(error);
    }
};


/**
 *  user list 
 * @param {object} req
 * @returns
 */
module.exports.userList = async (req) => {
    try {
        const {
            query: {
                limit,
                offset,
                search,
                sortBy,
                sortType,
            },
            user,
        } = req;
        let orderBy = [['id', 'DESC']];
        let where = {
            userType: userType.USER, id: { [Op.ne]: user?.id }
        };

        if (search
        ) {
            where[Op.or] = [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
            ]
        }
        if (sortBy && sortType) {
            orderBy = [[sortBy, sortType]];
        }

        let searchCriteria = {
            order: orderBy,
            where,
            col: 'id',
            distnict: true,
            limit: parseInt(limit ?? 10),
            offset: parseInt(offset ?? 0)
        };

        return User.scope('basic').findAndCountAll(searchCriteria);
    } catch (error) {
        throw Error(error);
    }
};

/**
 *  user login log list 
 * @param {object} req
 * @returns
 */
module.exports.userLoginLogList = async (req) => {
    try {
        const {
            query: {
                limit,
                offset,
                search,
                sortBy,
                sortType,
                userId
            },
            user,
        } = req;
        let orderBy = [['id', 'DESC']];
        let where = {
            '$User.user_type$': userType.USER, id: { [Op.ne]: user?.id }
        };

        if (search
        ) {
            where[Op.and] = [
                { '$User.first_name$': { [Op.like]: `%${search}%` } },
                { '$User.last_name$': { [Op.like]: `%${search}%` } },
                { '$User.email$': { [Op.like]: `%${search}%` } },
            ]
        }
        if (sortBy && sortType) {
            switch (sortBy) {
                case 'firstName':
                    orderBy = [[UserLoginLog.associations.User, 'first_name', sortType]];
                    break;
                case 'lastName':
                    orderBy = [[UserLoginLog.associations.User, 'last_name', sortType]];
                    break;
                case 'email':
                    orderBy = [[UserLoginLog.associations.User, 'email', sortType]];
                    break;
                default:
                    orderBy = [[sortBy, sortType]];
                    break;
            }
        }
        if (userId) {
            where.userId = userId;
        }

        let searchCriteria = {
            order: orderBy,
            where,
            col: 'id',
            distnict: true,
            include: [{
                model: User,
                attributes: ['firstName', 'lastName', 'email']
            }],
            limit: parseInt(limit ?? 10),
            offset: parseInt(offset ?? 0)
        };

        return UserLoginLog.findAndCountAll(searchCriteria);
    } catch (error) {
        throw Error(error);
    }
};


/**
 * movies create
 * @param {object} req
 * @returns
 */
module.exports.moviesCreate = async (req) => {
    const transaction = await models.sequelize.transaction();
    try {
        const {
            body, user
        } = req;
        body.createdById = user?.id
        const result = await Movie.create(body, { transaction });

        if (result) { await MovieLog.create({ ...body, movieId: result?.id, oldData: JSON.stringify(body) }, { transaction }) };
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw Error(error);
    }
};

/**
 * movies update
 * @param {object} req
 * @returns
 */
module.exports.moviesUpdate = async (req) => {
    const transaction = await models.sequelize.transaction();

    try {
        const {
            body, user, params: { id }, movieData,
        } = req;
        const where = {};
        if (id) {
            where.id = id;
        }

        body.updatedById = user?.id
        await Movie.update({ ...body }, { where }, { transaction });
        await MovieLog.create({ ...body, movieId: id, oldData: JSON.stringify(movieData), updateData: JSON.stringify(body) }, { transaction });
        await transaction.commit();
        return true
    } catch (error) {

        await transaction.rollback();
        throw Error(error);
    }
};

/**
* Get movies details
* @param {object} req
* @returns
*/
module.exports.moviesGet = async (req) => {
    try {
        const {
            body, params
        } = req;
        const where = {};
        if (params?.id) {
            where.id = params?.id;
        }

        return await Movie.scope('activeMovie').findOne({ where });
    } catch (error) {
        throw Error(error);
    }
};

/**
* movies delete
* @param {object} req
* @returns
*/
module.exports.moviesDelete = async (req) => {
    const transaction = await models.sequelize.transaction();
    try {
        const {
            params: { id }, movieData, user
        } = req;
        const where = { id };
        await Movie.update({ status: 'deleted', deletedById: user?.id }, { where }, { transaction });
        await MovieLog.create({ deletedById: user?.id, movieId: id, oldData: JSON.stringify(movieData), }, { transaction });
        await transaction.commit();
        return true
    } catch (error) {
        throw Error(error);
    }
};

/**
 *  movies list
 * @param {object} req
 * @returns
 */
module.exports.moviesList = async (req) => {
    try {
        const {
            query: {
                limit,
                offset,
                search,
                sortBy,
                sortType,
                userId
            },
            user,
        } = req;
        let orderBy = [[Sequelize.literal('(SELECT COUNT(DISTINCT(id)) FROM movie_ratings WHERE movie_id = Movie.id)'), 'DESC']];
        let where = {

        };
        if (user?.userType === userType.USER) {
            where.createdById = user?.id
        }
        if (userId) {
            where.createdById = userId;
        }
        if (search
        ) {
            where[Op.or] = [
                { director: { [Op.like]: `%${search}%` } },
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { genere: { [Op.like]: `%${search}%` } },
            ]
        }
        if (sortBy && sortType) {
            switch (sortBy) {
                case 'firstName':
                    orderBy = [[UserLoginLog.associations.User, 'first_name', sortType]];
                    break;
                case 'lastName':
                    orderBy = [[UserLoginLog.associations.User, 'last_name', sortType]];
                    break;
                case 'email':
                    orderBy = [[UserLoginLog.associations.User, 'email', sortType]];
                    break;
                default:
                    orderBy = [[sortBy, sortType]];
                    break;
            }
        }

        let searchCriteria = {
            order: orderBy,
            where,
            col: 'id',
            distnict: true,
            include: [{
                model: User,
                attributes: ['firstName', 'lastName', 'email']
            }],
            limit: parseInt(limit ?? 10),
            offset: parseInt(offset ?? 0)
        };

        return await Movie.scope('activeMovie').findAndCountAll(searchCriteria);
    } catch (error) {
        throw Error(error);
    }
};

/**
 * movies Rating
 * @param {object} req
 * @returns
 */
module.exports.moviesRating = async (req) => {
    try {
        const {
            body, user, params: { id }
        } = req;
        const where = {
            movieId: id,
            userId: user?.id,
        }
        const [movieResult, created] = await MovieRating
            .findOrCreate({
                where,
                defaults: {
                    ...where,
                    ...body
                },
            })
        return created ? movieResult : false;
    } catch (error) {
        throw Error(error);
    }
};
