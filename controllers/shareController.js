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
    });
  } catch (err) {
    console.error("Error viewing shared folder:", err);
    res.status(500).send("Server error");
  }
};
