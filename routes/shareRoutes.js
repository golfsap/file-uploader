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

shareRouter.get(
  "/shared/:token/files/:fileId/download",
  shareController.downloadSharedFile
);

shareRouter.get(
  "/folders/:folderId/shares",
  isAuth,
  shareController.getShareLinks
);

/**
 * -------------- DELETE ROUTES ----------------
 */

shareRouter.delete("/shares/:id", isAuth, shareController.revokeShareLink);

module.exports = shareRouter;
