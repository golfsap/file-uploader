const { Router } = require("express");
const authRoutes = require("./auth");
const fileRoutes = require("./files");
const folderRoutes = require("./folders");

const indexRouter = Router();

indexRouter.get("/", (req, res) => res.render("index"));

indexRouter.use("/", authRoutes);
indexRouter.use("/", fileRoutes);
indexRouter.use("/", folderRoutes);

module.exports = indexRouter;
