import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const name = path.basename(req.query.name || "");

  const allowed = [
    "logo.png",
    "LOGO2.png",
    "err.png",
    "IAPW.png"
  ];

  if (!allowed.includes(name)) {
    return res.status(404).send("Not Found");
  }

  const filePath = path.join(process.cwd(), "assets", name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Not Found");
  }

  const ext = path.extname(name).toLowerCase();

  const types = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif"
  };

  res.setHeader("Content-Type", types[ext] || "application/octet-stream");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

  fs.createReadStream(filePath).pipe(res);
}