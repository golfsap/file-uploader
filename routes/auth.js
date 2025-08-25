const { Router } = require("express");
const authController = require("../controllers/authController");
const { signupValidator, loginValidator } = require("../validators/validator");

const authRouter = Router();

/**
 * -------------- POST ROUTES ----------------
 */

authRouter.post("/signup", signupValidator, authController.signup);

authRouter.post("/login", loginValidator, authController.login);

/**
 * -------------- GET ROUTES ----------------
 */

authRouter.get("/signup", authController.showSignupForm);

authRouter.get("/login", authController.showLoginForm);

authRouter.get("/logout", authController.logout);

module.exports = authRouter;
