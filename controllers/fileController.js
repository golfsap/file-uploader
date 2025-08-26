const prisma = require("../db/client");
const path = require("path");

exports.uploadFileToFolder = async (req, res) => {
  const folderId = parseInt(req.params.folderId, 10);

  try {
    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        folderId,
      },
    });
    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    console.error("Error creating file:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  const fileId = parseInt(req.params.id, 10);
  const folderId = parseInt(req.body.folderId, 10);

  try {
    await prisma.file.deleteMany({
      where: { id: fileId, folderId },
    });
    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).send("Server error");
  }
};

exports.getFileDetails = async (req, res) => {
  const fileId = parseInt(req.params.id, 10);

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: { folder: true },
    });

    if (!file) {
      return res.status(404).send("File not found");
    }

    if (file.folder.userId !== req.user.id) {
      return res.status(403).send("Not authorized");
    }

    res.render("files/details", { file });
  } catch (err) {
    console.error("Error fetching file details:", err);
    res.status(500).send("Server error");
  }
};

exports.downloadFile = async (req, res) => {
  const fileId = parseInt(req.params.id, 10);

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: { folder: true },
    });

    if (!file) {
      return res.status(404).send("File not found");
    }

    if (file.folder.userId !== req.user.id) {
      return res.status(403).send("Not authorized");
    }

    res.download(path.resolve(file.path), file.name);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).send("Server error");
  }
};
