const supabase = require("../config/supabase");
const prisma = require("../db/client");
const crypto = require("crypto");

// Generate a shareable link
exports.createShareLink = async (req, res) => {
  const folderId = parseInt(req.params.folderId, 10);
  const { duration } = req.body; // duration in hours

  try {
    // Verify folder ownership
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return res.status(404).json({
        error: "Folder not found",
      });
    }

    if (folder.userId !== req.user.id) {
      console.log("Folder user id:", folder.userId);
      console.log("User id:", req.user.id);
      return res.status(403).json({ error: "Not authorized" });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString("hex");

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + parseInt(duration, 10));

    // Create share record
    const share = await prisma.folderShare.create({
      data: {
        folderId,
        token,
        expiresAt,
      },
    });

    // Generate shareable URL
    const shareUrl = `${req.protocol}://${req.get("host")}/shared/${token}`;

    res.status(200).json({
      success: true,
      shareUrl,
      expiresAt,
    });
  } catch (err) {
    console.error("Error creating share link:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// View shared folder (public access)
exports.viewSharedFolder = async (req, res) => {
  const { token } = req.params;

  try {
    const share = await prisma.folderShare.findUnique({
      where: { token },
      include: {
        folder: {
          include: {
            files: true,
          },
        },
      },
    });

    if (!share) {
      return res.status(404).render("error", {
        title: "Error",
        message: "Shared link not found or has expired",
      });
    }

    // Check if expired
    if (new Date() > share.expiresAt) {
      return res.status(410).render("error", {
        title: "Error",
        message: "This shared link has expired",
      });
    }

    res.render("share/view", {
      title: share.folder.name,
      folder: share.folder,
      files: share.folder.files,
      expiresAt: share.expiresAt,
      token: token,
    });
  } catch (err) {
    console.error("Error viewing shared folder:", err);
    res.status(500).send("Server error");
  }
};

// Download file from shared folder (public access)
exports.downloadSharedFile = async (req, res) => {
  const { token, fileId } = req.params;

  try {
    const share = await prisma.folderShare.findUnique({
      where: { token },
      include: {
        folder: {
          include: {
            files: {
              where: {
                id: parseInt(fileId, 10),
              },
            },
          },
        },
      },
    });

    if (!share || share.folder.files.length === 0) {
      return res.status(404).send("File not found");
    }

    // Check if expired
    if (new Date() > share.expiresAt) {
      return res.status(410).send("This shared link has expired");
    }

    const file = share.folder.files[0];

    // Create signed URL
    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(file.path, 60);

    if (error) throw error;

    res.redirect(data.signedUrl);
  } catch (err) {
    console.error("Error downloading shared file:", err);
    res.status(500).send("Server error");
  }
};

// List all share links for a folder
exports.getShareLinks = async (req, res) => {
  const folderId = parseInt(req.params.folderId, 10);

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(403).render("error", {
        title: "Error",
        message: "Not authorized",
      });
    }

    const shares = await prisma.folderShare.findMany({
      where: {
        folderId,
        expiresAt: {
          gt: new Date(), // Only active links
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ shares });
  } catch (err) {
    console.error("Error fetching share links:", err);
    res.status(500).json({ error: "Server error" });
  }
};
