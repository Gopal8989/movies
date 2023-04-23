const { Router } = require("express");
const router = Router();
const middlewares = require('../middlewares/index.js');
const userValidator = require('../validations/user.js');
const {
    validateMiddleware,
} = middlewares;
const userController = require("../controller/user.controller");

router.post("/user",
    validateMiddleware(userValidator.userCreateSchema),
    userController.userCreate);

router.get("/user", userController.userList);

router.post("/user/:id", validateMiddleware(userValidator.userIdSchema),
    userController.userDetails);

router.put("/user/:id", validateMiddleware(userValidator.userUpdateDetailSchema),
    userController.updateUser);

router.delete("/user/:id", validateMiddleware(userValidator.userIdSchema),
    userController.userDelete);

module.exports = router;
