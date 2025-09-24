// backend/routes/supportRoutes.js
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import Support from "../models/support.js"; // ⟵ change to "../models/Support.js" if your file is capitalized

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure /uploads/support exists
const uploadRoot = path.join(__dirname, "..", "uploads", "support");
fs.mkdirSync(uploadRoot, { recursive: true });

// ----- Multer setup -----
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "file-" + unique + path.extname(file.originalname || ""));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const okExt = /\.(png|jpe?g|pdf)$/i.test(file.originalname || "");
    const okMime = /(image\/png|image\/jpeg|application\/pdf)$/i.test(
      file.mimetype || ""
    );
    return okExt && okMime
      ? cb(null, true)
      : cb(new Error("Only PNG, JPG, JPEG, PDF allowed"));
  },
});

// helpers
const unlinkSafe = async (absPath) => {
  try {
    await fs.promises.unlink(absPath);
  } catch {
    /* ignore */
  }
};

const parseKeep = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  try {
    const arr = JSON.parse(val);
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return String(val)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
};

// ========== CREATE ==========
router.post("/inquiry", upload.array("files", 5), async (req, res) => {
  try {
    const { name, email, phone, inquiryType, subject, message } = req.body;

    const files = (req.files || []).map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/support/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype,
      uploadedAt: new Date(),
    }));

    const inquiry = await Support.create({
      name,
      email,
      phone,
      inquiryType,
      subject,
      message,
      files,
    });

    res
      .status(201)
      .json({ message: "Inquiry submitted successfully", inquiry });
  } catch (err) {
    console.error("Create inquiry error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== READ BY ID ==========
router.get("/inquiry/:id", async (req, res) => {
  try {
    const inquiry = await Support.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== LIST ==========
router.get("/inquiries", async (_req, res) => {
  try {
    const inquiries = await Support.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== APPROVE / UNAPPROVE (PATCH) ==========
router.patch("/inquiry/:id/approve", async (req, res) => {
  try {
    const { approved } = req.body; // boolean
    const inquiry = await Support.findByIdAndUpdate(
      req.params.id,
      { approved: !!approved },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.json({ message: "Updated", inquiry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== UPDATE (text + files) ==========
router.put("/inquiry/:id", upload.array("files", 5), async (req, res) => {
  try {
    const doc = await Support.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Inquiry not found" });

    const keepNames = parseKeep(req.body.keep); // array of filenames to keep
    const kept = (doc.files || []).filter((f) => keepNames.includes(f.filename));

    const newFiles = (req.files || []).map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: `/uploads/support/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype,
      uploadedAt: new Date(),
    }));

    if (kept.length + newFiles.length > 5) {
      return res
        .status(400)
        .json({ message: "Maximum 5 total attachments allowed" });
    }

    // remove dropped files from disk
    const removed = (doc.files || []).filter(
      (f) => !keepNames.includes(f.filename)
    );
    await Promise.all(
      removed.map((f) => unlinkSafe(path.join(uploadRoot, f.filename)))
    );

    // update scalar fields
    const fields = [
      "name",
      "email",
      "phone",
      "inquiryType",
      "subject",
      "message",
      "status",
    ];
    fields.forEach((k) => {
      if (k in req.body) doc[k] = req.body[k];
    });

    // update files
    doc.files = [...kept, ...newFiles];

    await doc.save();
    res.json({ message: "Inquiry updated successfully", inquiry: doc });
  } catch (err) {
    console.error("Update inquiry error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== DELETE ==========
router.delete("/inquiry/:id", async (req, res) => {
  try {
    const doc = await Support.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Inquiry not found" });

    // try to clean up files
    await Promise.all(
      (doc.files || []).map((f) =>
        unlinkSafe(path.join(uploadRoot, f.filename))
      )
    );

    res.json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========== STATS ==========
router.get("/stats/overview", async (_req, res) => {
  try {
    const [
      totalInquiries,
      newInquiries,
      inProgressInquiries,
      resolvedInquiries,
    ] = await Promise.all([
      Support.countDocuments(),
      Support.countDocuments({ status: "new" }),
      Support.countDocuments({ status: "in-progress" }),
      Support.countDocuments({ status: "resolved" }),
    ]);
    res.json({
      totalInquiries,
      newInquiries,
      inProgressInquiries,
      resolvedInquiries,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----- Multer/validation error handler -----
router.use((err, _req, res, next) => {
  if (
    err instanceof multer.MulterError ||
    /(Only PNG, JPG, JPEG, PDF allowed)/i.test(err.message || "")
  ) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

export default router;
