const Router = require("express");
const userRouter = require("./user.js");

const router = Router();
const register = (app) => {
    app.use(router);

    router.use("/api", [userRouter]);

    app.use((req, res, next) => {
        const error = new Error("Not Found");
        error.status = 404;
        res.status(error.status).json({
            success: false,
            data: null,
            error,
            message: error.message,
        });
    });

    app.use((error, req, res, next) => {

        console.log(error.message)
        res.status(error.status || 500).json({
            success: false,
            data: null,
            error,
            message: !error.status ? "Internal Server Error" : error.message,
        });
    });
};
module.exports = register;
