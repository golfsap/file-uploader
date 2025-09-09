const express = require("express");
const path = require("node:path");
const routes = require("./routes");
const session = require("express-session");
const passport = require("passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const expressLayouts = require("express-ejs-layouts");

/**
 * -------------- GENERAL SETUP ----------------
 */

require("dotenv").config();

const app = express();

// set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// enable layouts
app.use(expressLayouts);
// set default layout (relative to views folder, no ".ejs")
app.set("layout", "partials/layout");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/**
 * -------------- SESSION SETUP ----------------
 */

const prisma = require("./db/client");

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms, clean up expired sessions
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// app.use((req, res, next) => {
//   if (req.session) {
//     console.log(
//       "Session expires at:",
//       new Date(Date.now() + req.session.cookie.maxAge).toLocaleString()
//     );
//   }
//   next();
// });

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

const initializePassport = require("./config/passport");
initializePassport(passport);

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log("Session ID:", req.sessionID);
    console.log("Current user:", req.user);
    next();
  });
}

/**
 * -------------- ROUTES ----------------
 */

app.use("/", routes);

/**
 * -------------- ERROR HANDLER ----------------
 */

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Something went wrong");
});

/**
 * -------------- SERVER ----------------
 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
