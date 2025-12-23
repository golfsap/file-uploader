const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const prisma = require("../db/client");
const { Prisma } = require("../generated/prisma");

exports.showSignupForm = (req, res) => {
  res.render("signup", { title: "Signup", formData: {} });
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("signup", {
      title: "Signup",
      errors: errors.array().map((e) => e.msg),
      formData: { email },
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash } });

    if (!user) {
      return res.render("signup", {
        title: "Signup",
        errors: ["Could not register user"],
        formData: { email },
      });
    }

    res.redirect("/login");
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.render("signup", {
          title: "Signup",
          errors: ["Email already registered"],
          formData: { email },
        });
      }
    }
    console.error("Signup error:", err);
  }
};

exports.showLoginForm = (req, res) => {
  res.render("login", { title: "Login", formData: {} });
};

exports.login = (req, res, next) => {
  const { email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("login", {
      errors: errors.array().map((e) => e.msg),
      title: "Login",
      formData: { email },
    });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return next(err);
    }
    if (!user) {
      return res.render("login", {
        errors: [info.message],
        title: "Login",
        formData: { email },
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    res.redirect("/");
  });
};
