const { Router } = require("express");
const router = Router();
const middlewares = require('../middlewares/index.js');
const userValidator = require('../validations/user.js');
const {
    validateMiddleware,
    authMiddleware,
} = middlewares;
const userController = require("../controller/user.controller");

router.post("/login",
    validateMiddleware(userValidator.loginSchema),
    userController.userLogin);

router.post("/logout",
    authMiddleware,
    userController.userLogout);

router.post("/user",
    validateMiddleware(userValidator.userCreateSchema),
    userController.userCreate);

router.get("/user/detail",
    authMiddleware,
    userController.userDetails);

router.put("/user/:id", validateMiddleware(userValidator.userUpdateDetailSchema),
    userController.updateUser);

router.get("/user", authMiddleware, userController.userList);

router.post("/tweet",
    authMiddleware,
    validateMiddleware(userValidator.tweetCreateSchema),
    userController.tweetCreate);

router.put("/tweet/:id",
    authMiddleware,
    validateMiddleware(userValidator.tweetUpdateSchema),
    userController.tweetUpdate);

router.get("/tweet", authMiddleware, userController.tweetList);

router.get("/tweet/:id", authMiddleware, validateMiddleware(userValidator.userIdSchema),
    userController.tweetGet);

router.delete("/tweet/:id", authMiddleware, validateMiddleware(userValidator.userIdSchema),
    userController.tweetDelete);

router.post("/follow-user",
    authMiddleware,
    validateMiddleware(userValidator.followerCreateSchema),
    userController.followUser);

router.get("/follow-user",
    authMiddleware,
    userController.followUserGet);
module.exports = router;
