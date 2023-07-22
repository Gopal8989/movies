const { Router } = require("express");
const router = Router();
const middlewares = require('../middlewares/index.js');
const userValidator = require('../validations/user.js');
const {
    validateMiddleware,
    authMiddleware,
    authriztaionMiddleware,
    mediaMiddleware
} = middlewares;
const userController = require("../controller/user.controller");
const { userType } = require("../constant/enum.js");

router.post("/login",
    validateMiddleware(userValidator.loginSchema),
    userController.userLogin);

router.post("/logout",
    authMiddleware,
    authriztaionMiddleware([userType.ADMIN, userType.USER]),
    userController.userLogout);

router.post("/user",
    validateMiddleware(userValidator.userCreateSchema),
    userController.userCreate);

router.get("/user/detail",
    authMiddleware,
    authriztaionMiddleware([userType.ADMIN, userType.USER]),
    userController.userDetails);

router.get("/user/email-veriry/:token",
    validateMiddleware(userValidator.emailVerifySchema),
    userController.emailVerify);

router.post("/reset/password/link",
    validateMiddleware(userValidator.resetPasswordSchema),
    userController.resetPasswordLink);

router.post("/reset/password/:token",
    validateMiddleware(userValidator.changePasswordSchema),
    userController.resetPassword);

router.put("/user/:id", authMiddleware,
    authriztaionMiddleware([userType.USER]), validateMiddleware(userValidator.userUpdateDetailSchema),
    userController.updateUser);

router.get("/user", authMiddleware, userController.userList);

router.get("/user", authMiddleware, userController.userList);

router.get("/user/login-log", authMiddleware, userController.userLoginLogList);

router.post("/movies",
    authMiddleware,
    authriztaionMiddleware([userType.USER]),
    validateMiddleware(userValidator.moviesCreateSchema),
    mediaMiddleware.uploadMedia,
    userController.moviesCreate);

router.post("/upload-media",
    authMiddleware,
    authriztaionMiddleware([userType.USER]),
    validateMiddleware(userValidator.mediaCreateSchema),
    mediaMiddleware.uploadMedia,
    userController.uploadMediaForMovies);

router.put("/movies/:id",
    authMiddleware,
    authriztaionMiddleware([userType.USER]),
    validateMiddleware(userValidator.moviesUpdateSchema),
    mediaMiddleware.uploadMedia,
    userController.moviesUpdate);

router.get("/movies", authMiddleware, userController.moviesList);

router.get("/movies/:id", authMiddleware, validateMiddleware(userValidator.userIdSchema),
    userController.moviesGet);

router.delete("/movies/:id", authMiddleware,
    authriztaionMiddleware([userType.USER]), validateMiddleware(userValidator.userIdSchema),
    userController.moviesDelete);

router.post("/rating/:id",
    authMiddleware,
    authriztaionMiddleware([userType.USER]),
    validateMiddleware(userValidator.ratingCreateSchema),
    userController.moviesRating);

module.exports = router;
