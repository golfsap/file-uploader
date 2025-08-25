const { Router } = require("express");
const authRoutes = require("./auth");
const fileRoutes = require("./files");

const indexRouter = Router();

indexRouter.get("/", (req, res) => res.render("index"));

indexRouter.use("/", authRoutes);
indexRouter.use("/", fileRoutes);

module.exports = indexRouter;
