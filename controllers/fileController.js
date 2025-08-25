exports.showUploadForm = (req, res) => {
  res.render("upload");
};

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("File uploaded:", req.file);
  res.send(`File ${req.file.originalname} uploaded successfully.`);
};
