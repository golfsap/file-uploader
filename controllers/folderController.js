const prisma = require("../db/client");

exports.createFolder = async (req, res) => {
  const { name } = req.body;

  try {
    const folder = await prisma.folder.create({
      data: { name, userId: req.user.id },
    });
    res.redirect("/folders");
  } catch (err) {
    console.error("Error creating folder:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserFolders = async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.render("folders/index", { folders });
  } catch (err) {
    console.error("Error getting user folders:", err);
    res.status(500).send("Server error");
  }
};

exports.viewFolder = async (req, res) => {
  try {
    const folder = await prisma.folder.findFirst({
      where: { id: parseInt(req.params.id, 10), userId: req.user.id },
      include: { files: true },
    });

    if (!folder) return res.status(404).send("Folder not found");

    res.render("folders/view", { folder, files: folder.files });
  } catch (err) {
    console.error("Error viewing folder:", err);
    res.status(500).send("Server error");
  }
};

exports.renameFolder = async (req, res) => {
  const { newName } = req.body;

  try {
    const updated = await prisma.folder.updateMany({
      where: { id: parseInt(req.params.id, 10), userId: req.user.id },
      data: { name: newName },
    });
    res.redirect("/folders");
  } catch (err) {
    console.error("Error renaming folder:", err);
    res.status(500).send("Server error");
  }
};

exports.deleteFolder = async (req, res) => {
  const folderId = parseInt(req.params.id, 10);

  try {
    await prisma.folder.deleteMany({
      where: { id: folderId, userId: req.user.id },
    });
    res.redirect("/folders");
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.status(500).send("Server error");
  }
};
