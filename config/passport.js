const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(customFields, async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
          return done(null, false, {
            message: "Incorrect email",
          });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
