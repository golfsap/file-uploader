const { Router } = require("express");
const userController = require("../controllers/userController");
const { signupValidator } = require("../validators/validator");

const usersRouter = Router();

/**
 * -------------- POST ROUTES ----------------
 */

usersRouter.post("/signup", signupValidator, userController.signup);

/**
 * -------------- GET ROUTES ----------------
 */

usersRouter.get("/signup", userController.showSignupForm);

usersRouter.get("/login", userController.showLoginForm);

module.exports = usersRouter;
