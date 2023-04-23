// Init code
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
let citySchema = require("./city.js");
let departmentSchema = require("./department.js");

const db = require("../database");
const department = require("./department.js");

const employeeSchema = mongoose.Schema(
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
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

module.exports.userDetails = async (req) => {
    try {
        let query = {
            _id: ObjectId(req?.params?.id),
        };

        return await db.collection("employees").findOne(query);
    } catch (error) {
        throw Error(error);
    }
};

module.exports.checkEmail = async (req) => {
    try {
        let query = {
            email: req?.body?.email,
        };

        return await db.collection("employees").findOne(query);
    } catch (error) {
        throw Error(error);
    }
};



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
            body: { first_name, last_name, email, city, department },
        } = req;
        let user = mongoose.model("employees", employeeSchema);

        let userModel = new user({
            first_name,
            last_name,
            email,
        },
            // { session }
        );
        const userResult = await userModel.save();
        if (userResult) {
            const employeeId = new ObjectId(userResult?._id);
            let cityModel = citySchema({
                employee_id: employeeId,
                name: city,

            },
                // { session }
            );
            await cityModel.save();
            let departmentModel = departmentSchema({
                employee_id: employeeId,
                name: department,

            },
                // { session }
            );
            await departmentModel.save();
            // await session.commitTransaction();
            // await session.endSession();
            return userResult;

        }
        // await session.abortTransaction();
        // await session.endSession();
        return false
    } catch (error) {
        // await session.abortTransaction();
        // await session.endSession();
        throw Error(error);
    }
};

module.exports.userList = async (req) => {
    try {

        const { query: { employeeId, limit, skip } } = req;

        const query = {}
        if (employeeId) {
            query._id = new ObjectId(employeeId);
        }
        let matchQuery = [
            { "$match": query },
            {
                $lookup: {
                    from: "cities",
                    as: "City",
                    let: { employeeId: { "$toObjectId": '$_id' } },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    { $ex    pr: { $eq: ["$employee_id", "$$employeeId"] } },
                                ]
                            }
                        }
                    ]

                }
            },
            {
                $lookup: {
                    from: "departments",
                    as: "Department",
                    let: { employeeId: { "$toObjectId": '$_id' } },
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    { $expr: { $eq: ["$employee_id", "$$employeeId"] } },
                                ]
                            }
                        }
                    ]

                }
            },
            { $unwind: "$City" },
            { $unwind: "$Department" },
            {
                $project: {
                    _id: 1, first_name: 1, last_name: 1, email: 1, created_at: 1,
                    'city': "$City.name",
                    'department': "$Department.name",
                }
            },
            { "$sort": { 'created_at': -1 } },
            { "$skip": parseInt(skip ?? 0) },
            { "$limit": parseInt(limit ?? 100) }
        ]

        // Actual query
        return await db.collection("employees").aggregate(matchQuery).toArray();
    } catch (error) {
        throw Error(error);
    }
};

module.exports.deleteUser = async (req) => {
    try {
        const {
            params: { id },
        } = req;
        let userModel = mongoose.model("employees", employeeSchema);
        let query = {
            _id: new ObjectId(id),
        };
        const result = await userModel.findByIdAndDelete(query);
        if (result) {
            await citySchema.deleteOne({ employee_id: query?._id });;
            await departmentSchema.deleteOne({ employee_id: query?._id });;
            return true;
        }
    } catch (error) {
        throw Error(error);
    }
};

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
        const result = await db.collection("employees").findOneAndUpdate(query, data);
        if (result) {
            await db.collection("cities").updateOne({ employee_id: query?._id }, {
                $set: {
                    name: city,
                },
            });
            await db.collection("departments").findOneAndUpdate({ employee_id: query?._id }, {
                $set: {
                    name: department,
                },
            });
        }
        return result
    } catch (error) {
        throw Error(error);
    }
};

// Module exports
module.exports.employeeSchema = mongoose.model("employees", employeeSchema);
