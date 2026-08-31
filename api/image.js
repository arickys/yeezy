const fs = require("fs");
const path = require("path");

const allowedFiles = {
  "logo.png": "image/png",
  "LOGO2.png": "image/png",
  "err.png": "image/png",
  "IAPW.png": "image/png"
};

module.exports = (req, res) => {
  try {
    const file = String(req.query.file || "");

    if (!Object.prototype.hasOwnProperty.call(allowedFiles, file)) {
      return res.status(404).send("Not Found");
    }

    const filePath = path.join(
      process.cwd(),
      "assets",
      file
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Not Found");
    }

    const image = fs.readFileSync(filePath);

    res.setHeader(
      "Content-Type",
      allowedFiles[file]
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    res.setHeader(
      "X-Content-Type-Options",
      "nosniff"
    );

    return res.status(200).send(image);

  } catch {
    return res.status(500).send("Internal Server Error");
  }
};