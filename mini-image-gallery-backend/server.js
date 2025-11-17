const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    if (!allowed.includes(file.mimetype)) cb(new Error("Only JPEG / PNG allowed."));
    else cb(null, true);
  }
}).single("image");

// In-memory store: Map<id, { id, originalname, mimetype, buffer, size }>
const images = new Map();

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file received" });

    const id = uuidv4();
    const { originalname, mimetype, buffer, size } = req.file;
    images.set(id, { id, originalname, mimetype, buffer, size, uploadedAt: Date.now() });

    res.json({ ok: true, id, filename: originalname });
  });
});

// Return metadata list
app.get("/images", (req, res) => {
  const list = Array.from(images.values()).map(img => ({
    id: img.id,
    filename: img.originalname,
    size: img.size,
    mimetype: img.mimetype,
    uploadedAt: img.uploadedAt
  }));
  res.json(list);
});

// Serve raw image bytes
app.get("/images/:id", (req, res) => {
  const id = req.params.id;
  const img = images.get(id);
  if (!img) return res.status(404).json({ error: "Not found" });

  res.setHeader("Content-Type", img.mimetype);
  res.send(img.buffer);
});

// Serve thumbnail (resized) — cached in memory Map thumbnails on first request optionally
// We'll generate a 300px width thumbnail (preserves aspect ratio)
const thumbnails = new Map(); // Map<id, { buffer, mimetype }>
app.get("/images/:id/thumbnail", async (req, res) => {
  const id = req.params.id;
  const img = images.get(id);
  if (!img) return res.status(404).json({ error: "Not found" });

  // If we already generated, return it
  if (thumbnails.has(id)) {
    const t = thumbnails.get(id);
    res.setHeader("Content-Type", t.mimetype);
    return res.send(t.buffer);
  }

  try {
    // Create a resized buffer (300px wide max)
    const thumbBuffer = await sharp(img.buffer)
      .resize({ width: 300, withoutEnlargement: true })
      .toFormat("jpeg", { quality: 75 })
      .toBuffer();

    const mimetype = "image/jpeg";
    thumbnails.set(id, { buffer: thumbBuffer, mimetype });
    res.setHeader("Content-Type", mimetype);
    return res.send(thumbBuffer);
  } catch (err) {
    console.error("Thumbnail error:", err);
    return res.status(500).json({ error: "Failed to create thumbnail" });
  }
});

// Delete image and any cached thumbnail
app.delete("/images/:id", (req, res) => {
  const id = req.params.id;
  if (!images.has(id)) return res.status(404).json({ error: "Not found" });

  images.delete(id);
  thumbnails.delete(id);
  res.json({ ok: true });
});

// Health
app.get("/", (req, res) => res.send("Mini Image Gallery backend running"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
