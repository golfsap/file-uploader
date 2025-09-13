const prisma = require("../db/client");
// const path = require("path");
const supabase = require("../config/supabase");
const { Prisma } = require("@prisma/client");

exports.uploadFileToFolder = async (req, res) => {
  const folderId = parseInt(req.params.folderId, 10);
  const file = req.file;

  try {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `${req.user.id}/${folderId}/${fileName}`;

    // upload to Supabase storage bucket
    const { error } = await supabase.storage
      .from("files")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    // save to DB
    const savedFile = await prisma.file.create({
      data: {
        name: file.originalname,
        path: filePath,
        size: file.size,
        mimetype: file.mimetype,
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
    // find file in DB
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
      include: {
        folder: true,
      },
    });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (file.folder.userId !== req.user.id) {
      return res.status(403).send("Not authorized to delete this file");
    }

    // delete from supabase storage bucket
    const { error } = await supabase.storage.from("files").remove([file.path]);

    if (error) throw error;

    // delete from DB
    await prisma.file.delete({
      where: { id: fileId },
    });
    res.status(200).json({ success: true });
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

    res.render("files/details", { title: "Details", file });
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
      return res.status(403).send("Not authorized to download this file");
    }

    // Create a signed URL valid for 60s
    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(file.path, 60);

    if (error) throw error;

    res.redirect(data.signedUrl);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).send("Server error");
  }
};

exports.getRecentFiles = async (req, res) => {
  try {
    const recentFiles = await prisma.file.findMany({
      where: {
        folder: {
          userId: req.user.id,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        folder: true,
      },
    });

    res.render("files/recent", { title: "Recent Files", recentFiles });
  } catch (err) {
    console.error("Error retrieving recent files:", err);
    res.status(500).send("Server error");
  }
};
