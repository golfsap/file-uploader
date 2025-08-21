const { Router } = require("express");
const usersRoutes = require("./users");

const indexRouter = Router();

indexRouter.get("/", (req, res) => res.render("index"));

indexRouter.use("/", usersRoutes);

module.exports = indexRouter;
