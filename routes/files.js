const { Router } = require("express");
const fileController = require("../controllers/fileController");
const { isAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { file } = require("../db/client");

const fileRouter = Router();

/**
 * -------------- POST ROUTES ----------------
 */

// fileRouter.post(
//   "/upload",
//   isAuth,
//   upload.single("file"),
//   fileController.uploadFile
// );

fileRouter.post(
  "/files/upload/:folderId",
  isAuth,
  upload.single("file"),
  fileController.uploadFileToFolder
);

fileRouter.post("/files/:id/delete", isAuth, fileController.deleteFile);

/**
 * -------------- GET ROUTES ----------------
 */

// fileRouter.get("/upload", isAuth, fileController.showUploadForm);

module.exports = fileRouter;
