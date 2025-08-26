const { Router } = require("express");
const folderController = require("../controllers/folderController");
const { isAuth } = require("../middleware/authMiddleware");

const folderRouter = Router();

/**
 * -------------- POST ROUTES ----------------
 */

folderRouter.post("/folders", isAuth, folderController.createFolder);

/**
 * -------------- GET ROUTES ----------------
 */

folderRouter.get("/folders", isAuth, folderController.getUserFolders);

folderRouter.get("/folders/:id", isAuth, folderController.viewFolder);

module.exports = folderRouter;
