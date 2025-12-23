const { Router } = require("express");
const fileController = require("../controllers/fileController");
const { isAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
// const { file } = require("../db/client");

const fileRouter = Router();

/**
 * -------------- POST ROUTES ----------------
 */

fileRouter.post(
  "/files/upload/:folderId",
  isAuth,
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload.single("file")(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      next();
    } catch (err) {
      console.error("Caught upload error:", err.message);
      return res.status(400).json({ error: err.message });
    }
  },
  fileController.uploadFileToFolder
);

fileRouter.post("/files/:id/delete", isAuth, fileController.deleteFile);

/**
 * -------------- GET ROUTES ----------------
 */

fileRouter.get("/files/recent", isAuth, fileController.getRecentFiles);

fileRouter.get("/files/:id", isAuth, fileController.getFileDetails);

fileRouter.get("/files/:id/download", isAuth, fileController.downloadFile);

module.exports = fileRouter;
