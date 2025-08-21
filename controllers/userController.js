const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const prisma = require("../db/client");
const { Prisma } = require("../generated/prisma");

exports.showSignupForm = (req, res) => {
  res.render("signup");
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("signup", {
      errors: errors.array().map((e) => e.msg),
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash } });

    if (!user) {
      return res.render("signup", {
        errors: ["Could not register user"],
      });
    }

    res.redirect("/login");
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.render("signup", { errors: ["Email already registered"] });
      }
    }
    console.error("Signup error:", err);
  }
};
