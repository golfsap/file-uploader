const prisma = require("../db/client");

// exports.showUploadForm = (req, res) => {
//   res.render("upload");
// };

// exports.uploadFile = (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }
//   console.log("File uploaded:", req.file);
//   res.send(`File ${req.file.originalname} uploaded successfully.`);
// };

exports.uploadFileToFolder = async (req, res) => {
  const folderId = parseInt(req.params.folderId, 10);

  try {
    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        path: req.file.path,
        userId: req.user.id,
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

  try {
    await prisma.file.deleteMany({
      where: { id: fileId, userId: req.user.id },
    });
    res.redirect(`/folders/${req.body.folderId}`);
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).send("Server error");
  }
};
