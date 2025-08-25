const { Router } = require("express");
const fileController = require("../controllers/fileController");
const { isAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const fileRouter = Router();

/**
 * -------------- POST ROUTES ----------------
 */

fileRouter.post(
  "/upload",
  isAuth,
  upload.single("file"),
  fileController.uploadFile
);

/**
 * -------------- GET ROUTES ----------------
 */

fileRouter.get("/upload", isAuth, fileController.showUploadForm);

module.exports = fileRouter;
