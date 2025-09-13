const { Router } = require("express");
const authRoutes = require("./auth");
const fileRoutes = require("./files");
const folderRoutes = require("./folders");
const folderController = require("../controllers/folderController");

const indexRouter = Router();

indexRouter.get("/", folderController.getHomePage);

indexRouter.use("/", authRoutes);
indexRouter.use("/", fileRoutes);
indexRouter.use("/", folderRoutes);

module.exports = indexRouter;
