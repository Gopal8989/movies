// Init code
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs');
let tweetSchema = require("./tweet.js");
let followerSchema = require("./follower.js");
const jwt = require('../service/jwt.service.js');
const db = require("../database");

const userSchema = mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        token: {
            type: String
        },

    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

/**
 * Get user details
 * @param {object} req 
 * @returns 
 */
module.exports.userDetails = async (req) => {
    try {
        let query = {
            _id: ObjectId(req?.params?.id),
        };

        return await db.collection("users").findOne(query);
    } catch (error) {
        throw Error(error);
    }
};


/**
 * Check user exist
 * @param {object} query 
 * @returns 
 */
module.exports.checkUserDetails = async (query) => {
    try {
        return await db.collection("users").findOne(query);
    } catch (error) {
        throw Error(error);
    }
};

/**
 * Check email exist
 * @param {object} req 
 * @returns 
 */
module.exports.checkEmail = async (req) => {
    try {
        let query = {
            email: req?.body?.email,
        };

        return await db.collection("users").findOne(query);
    } catch (error) {
        throw Error(error);
    }
};

/**
 * User list
 * @param {object} req 
 * @returns 
 */
module.exports.userList = async (req) => {
    try {

        const { query: { limit, skip } } = req;

        const query = {}
        let matchQuery = [
            { "$match": query },
            {
                $project: {
                    _id: 1, first_name: 1, last_name: 1, created_at: 1, email: 1
                }
            },
            { "$sort": { 'created_at': -1 } },
            { "$skip": parseInt(skip ?? 0) },
            { "$limit": parseInt(limit ?? 100) }
        ]

        // Actual query
        return await db.collection("users").aggregate(matchQuery).toArray();
    } catch (error) {
        throw Error(error);
    }
};

/**
 * User create
 * @param {object} req 
 * @returns 
 */
module.exports.userCreate = async (req) => {
    // const transactionOptions = {
    //     readConcern: { level: 'snapshot' },
    //     writeConcern: { w: 'majority' },
    //     readPreference: 'primary'
    // };
    // const session = await db.startSession();
    // session.startTransaction();
    try {
        const {
            body: { first_name, last_name, email, password },
        } = req;
        let user = mongoose.model("users", userSchema);

        const salt = await bcrypt.genSalt(); // password encrypt
        const saltPassword = await bcrypt.hash(password, salt);
        let userModel = new user({
            first_name,
            last_name,
            email,
            password: saltPassword,
        },
            // { session }
        );
        return await userModel.save();
        // if (userResult) {
        //     const employeeId = new ObjectId(userResult?._id);
        //     let cityModel = tweetSchema({
        //         employee_id: employeeId,
        //         name: city,

        //     },
        //         // { session }
        //     );
        //     await cityModel.save();
        //     let departmentModel = followerSchema({
        //         employee_id: employeeId,
        //         name: department,

        //     },
        //         // { session }
        //     );
        //     await departmentModel.save();
        //     // await session.commitTransaction();
        //     // await session.endSession();
        //     return userResult;

        // }
        // await session.abortTransaction();
        // await session.endSession();
        return false
    } catch (error) {
        // await session.abortTransaction();
        // await session.endSession();
        throw Error(error);
    }
};

/**
 * User update
 * @param {object} req 
 * @returns 
 */

module.exports.userUpdate = async (req) => {
    try {
        const {
            body: { first_name, last_name, department, city, email },
            params: { id },
        } = req;

        // Convert object id
        const query = { _id: new ObjectId(id) };
        const data = {
            $set: {
                first_name: first_name,
                last_name: last_name,
                email: email,
            },
        };
        return await db.collection("users").findOneAndUpdate(query, data);

    } catch (error) {
        throw Error(error);
    }
};

/**
 * User login
 * @param {object} req 
 * @returns 
 */
module.exports.userLogin = async (req, payload) => {
    try {
        const {
            _id, email
        } = payload;

        const result = await bcrypt.compare(req?.body?.password, payload?.password); // password check
        if (result) {
            const token = await jwt.createToken({
                user_id: _id,
                email: email,
            });
            // Convert object id
            const query = { _id: new ObjectId(_id) };
            const data = {
                $set: {
                    token: token,
                },
            };
            await db.collection("users").findOneAndUpdate(query, data);
            return token
        }
        return false;
    } catch (error) {
        throw Error(error);
    }
};

/**
 * User logout
 * @param {object} req 
 * @returns 
 */
module.exports.userLogout = async (req) => {
    try {
        const {
            user: { _id },
        } = req;


        // Convert object id
        const query = { _id: new ObjectId(_id) };
        const data = {
            $set: {
                token: null,
            },
        };
        return await db.collection("users").findOneAndUpdate(query, data);
    } catch (error) {
        throw Error(error);
    }
};


/**
 * Tweet create
 * @param {object} req 
 * @returns 
 */
module.exports.tweetCreate = async (req) => {
    try {
        const {
            body: { title, description, }, user
        } = req;

        let tweetModel = tweetSchema({
            title,
            description,
            user_id: new ObjectId(user?._id),
        },
        );
        return await tweetModel.save();
    } catch (error) {
        throw Error(error);
    }
};


module.exports.tweetGet = async (req) => {
    try {
        let query = {
            _id: new ObjectId(req?.params?.id),
        };

        return await db.collection("tweetes").findOne(query);
    } catch (error) {
        throw Error(error);
    }
};

/**
 * Tweet list
 * @param {object} req 
 * @returns 
 */
module.exports.tweetList = async (req) => {
    try {

        const { query: { limit, skip }, user: { _id } } = req;

        const query = {}
        if (_id) {
            const id = new ObjectId(_id);
            const followerResult =
                await db.collection("followers").find({ follow_id: _id }).toArray()
            if (followerResult && followerResult.length > 0) {
                query['$or'] = [
                    { user_id: id },
                    { user_id: { '$in': followerResult.map((e) => (new ObjectId(e?.follower_id))) } }
                ]
            } else {
                query.user_id = id;
            }
        }
        console.log(query)
        let matchQuery = [
            { "$match": query },
            {
                $project: {
                    _id: 1, title: 1, description: 1, created_at: 1,
                }
            },
            { "$sort": { 'created_at': -1 } },
            { "$skip": parseInt(skip ?? 0) },
            { "$limit": parseInt(limit ?? 100) }
        ]

        // Actual query
        return await db.collection("tweetes").aggregate(matchQuery).toArray();
    } catch (error) {
        throw Error(error);
    }
}

/**
 * Tweet update
 * @param {object} req 
 * @returns 
 */
module.exports.tweetUpdate = async (req) => {
    try {
        const {
            body: { title, description, }, user,
            params: { id },
        } = req;

        // Convert object id
        const query = { _id: new ObjectId(id) };
        const data = {
            $set: {
                title: title,
                description: description,
                // user_id: new ObjectId(user?.id),
            },
        };
        return await db.collection("tweetes").findOneAndUpdate(query, data);

    } catch (error) {
        throw Error(error);
    }
};

/**
 * Tweet delete
 * @param {object} req 
 * @returns 
 */
module.exports.tweetDelete = async (req) => {
    try {
        const {
            params: { id },
        } = req;
        let query = {
            _id: new ObjectId(id),
        };
        return await tweetSchema.deleteOne(query);
    } catch (error) {
        throw Error(error);
    }
};

/**
 * Follow user and unfollow
 * already exist delete 
 * @param {object} req 
 * @returns 
 */
module.exports.followUser = async (req) => {
    try {
        const {
            body: { user_id }, user: { _id }
        } = req;
        const query = { follow_id: new ObjectId(_id), follower_id: new ObjectId(user_id) }
        const result = await db.collection("followers").findOne(query);
        if (result) {
            return await followerSchema.deleteOne({ _id: result?._id });
        } else {
            let followerModel = followerSchema(query
            );
            return await followerModel.save();
        }
    } catch (error) {
        throw Error(error);
    }
};

/**
 * Follow user list and join user details
 * @param {object} req 
 * @returns 
 */
module.exports.followUserGet = async (req) => {
    try {

        const { query: { limit, skip }, user: { _id } } = req;

        const query = {}
        if (_id) {
            query.follow_id = new ObjectId(_id);
        }
        let matchQuery = [
            { "$match": query },
            {
                $lookup: {
                    from: "users",
                    as: "Followers",
                    let: { userId: { "$toObjectId": '$follow_id' } },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    { $expr: { $eq: ["$_id", "$$userId"] } },
                                ]
                            }
                        }
                    ]

                }
            },
            { $unwind: "$Followers" },
            {
                $lookup: {
                    from: "users",
                    as: "Follow",
                    let: { userId: { "$toObjectId": '$follower_id' } },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    { $expr: { $eq: ["$_id", "$$userId"] } },
                                ]
                            }
                        }
                    ]

                }
            },
            { $unwind: "$Follow" },
            { $unwind: "$Followers" },
            {
                $project: {
                    _id: 1, follower_id: 1, follow_id: 1, created_at: 1,
                    'follow_first_name': "$Follow.first_name",
                    'follow_last_name': "$Follow.last_name",
                    'follow_email': "$Follow.email",
                    'follower_first_name': "$Followers.first_name",
                    'follower_last_name': "$Followers.last_name",
                    'follower_email': "$Followers.email"
                }
            },
            { "$sort": { 'created_at': -1 } },
            { "$skip": parseInt(skip ?? 0) },
            { "$limit": parseInt(limit ?? 100) }
        ]

        // Actual query
        return await db.collection("followers").aggregate(matchQuery).toArray();
    } catch (error) {
        throw Error(error);
    }
};
// Module exports
module.exports.userSchema = mongoose.model("users", userSchema);
