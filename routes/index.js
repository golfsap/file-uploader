const { Router } = require("express");
const authRoutes = require("./auth");
const fileRoutes = require("./files");
const folderRoutes = require("./folders");
const shareRouter = require("./shareRoutes");
const folderController = require("../controllers/folderController");

const indexRouter = Router();

indexRouter.get("/", folderController.getHomePage);

indexRouter.use("/", authRoutes);
indexRouter.use("/", fileRoutes);
indexRouter.use("/", folderRoutes);
indexRouter.use("/", shareRouter);

module.exports = indexRouter;
