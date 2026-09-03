import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const file = path.basename(req.query.file || "");

    const allowedFiles = [
        "logo.png",
        "LOGO2.png",
        "err.png",
        "IAPW.png",
        "IAPWE.png",
        "NO_CIERTO_BESAME_MAMA.png",
        "graduation-bg.png"
    ];

    if (!allowedFiles.includes(file)) {
        return res.status(404).send("Not Found");
    }

    const filePath = path.join(process.cwd(), "assets", file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Not Found");
    }

    const extension = path.extname(file).toLowerCase();

    const contentTypes = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif"
    };

    const contentType = contentTypes[extension];

    if (!contentType) {
        return res.status(415).send("Unsupported file type");
    }

    res.status(200);

    res.setHeader("Content-Type", contentType);

    res.setHeader(
        "Cache-Control",
        "public, max-age=31536000, immutable"
    );

    fs.createReadStream(filePath).pipe(res);
}