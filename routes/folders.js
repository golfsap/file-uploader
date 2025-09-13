const { Router } = require("express");
const folderController = require("../controllers/folderController");
const { isAuth } = require("../middleware/authMiddleware");

const folderRouter = Router();

/**
 * -------------- POST ROUTES ----------------
 */

folderRouter.post("/folders", isAuth, folderController.createFolder);

folderRouter.post("/folders/:id/rename", isAuth, folderController.renameFolder);

folderRouter.post("/folders/:id/delete", isAuth, folderController.deleteFolder);

/**
 * -------------- GET ROUTES ----------------
 */

folderRouter.get("/folders", isAuth, folderController.getUserFolders);

folderRouter.get("/folders/:id", isAuth, folderController.viewFolder);

// folderRouter.get(
//   "/folders/*folderPath",
//   isAuth,
//   folderController.viewNestedFolder
// );

module.exports = folderRouter;
