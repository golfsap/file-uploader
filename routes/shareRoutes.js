const { Router } = require("express");
const shareController = require("../controllers/shareController");
const { isAuth } = require("../middleware/authMiddleware");

const shareRouter = Router();

/**
 * -------------- POST ROUTES ----------------
 */

shareRouter.post(
  "/folders/:folderId/share",
  isAuth,
  shareController.createShareLink
);

/**
 * -------------- GET ROUTES ----------------
 */

shareRouter.get("/shared/:token", shareController.viewSharedFolder);

module.exports = shareRouter;
