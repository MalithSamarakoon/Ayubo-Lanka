// backend/controllers/receipts.controller.js
import path from "path";
import fs from "fs";
import { isValidObjectId } from "mongoose";
import Receipt from "../models/Receipt.js";

const allowed = ["image/jpeg", "image/png", "application/pdf"];

function isValidDateStr(d) {
  return typeof d === "string" && !Number.isNaN(Date.parse(d));
}

export async function createReceipt(req, res) {
  try {
    const { bank, paymentDate, amount, paymentMethod, branch, notes } =
      req.body;

    // Basic validation
    const errors = {};
    if (!bank) errors.bank = "Bank is required";
    if (!isValidDateStr(paymentDate))
      errors.paymentDate = "Valid date required";
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0)
      errors.amount = "Amount must be > 0";
    if (
      !paymentMethod ||
      !["Online transfer", "Cash deposit", "ATM", "CDM"].includes(paymentMethod)
    ) {
      errors.paymentMethod = "Invalid payment method";
    }
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // File required
    if (!req.file) {
      return res.status(400).json({ message: "Receipt file is required" });
    }

    // Defense-in-depth for mime/size (multer already validates)
    if (!allowed.includes(req.file.mimetype)) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch {}
      return res.status(400).json({ message: "Invalid file type" });
    }
    if (req.file.size > 5 * 1024 * 1024) {
      try {
        await fs.promises.unlink(req.file.path);
      } catch {}
      return res.status(413).json({ message: "File too large (max 5MB)" });
    }

    // Public URL for saved file
    const filename = path.basename(req.file.path);
    const relPath = `uploads/receipts/${filename}`.replace(/\\/g, "/");

    const proto =
      req.headers["x-forwarded-proto"]?.split(",")[0] || req.protocol;
    const base = `${proto}://${req.get("host")}`;
    const fileUrl = `${base}/${relPath}`;

    const doc = await Receipt.create({
      bank,
      branch: branch || "",
      paymentDate: new Date(paymentDate),
      amount: Number(amount),
      paymentMethod,
      notes: notes || "",
      file: {
        url: fileUrl,
        publicId: undefined,
        mime: req.file.mimetype,
        sizeBytes: req.file.size,
        originalName: req.file.originalname,
        storage: "local",
      },
      status: "PENDING",
      createdByIp: req.ip,
    });

    return res.status(201).json({
      id: doc._id,
      status: doc.status,
      fileUrl: doc.file.url,
    });
  } catch (err) {
    console.error("createReceipt error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getReceipt(req, res) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const doc = await Receipt.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (err) {
    console.error("getReceipt error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function listReceipts(req, res) {
  try {
    const { status, page = 1, limit = 20, bank } = req.query;
    const q = {};
    if (status) q.status = status;
    if (bank) q.bank = bank;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Receipt.find(q).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Receipt.countDocuments(q),
    ]);

    return res.json({
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("listReceipts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function reviewReceipt(req, res) {
  try {
    const { id } = req.params;
    const { action, comment } = req.body; // APPROVED | REJECTED

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    if (!["APPROVED", "REJECTED"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const doc = await Receipt.findById(id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    const reviewerId = req.user?.id || undefined;
    doc.status = action;
    doc.review = {
      byUserId: reviewerId,
      at: new Date(),
      comment: comment || "",
    };

    await doc.save();
    return res.json({ id: doc._id, status: doc.status, review: doc.review });
  } catch (err) {
    console.error("reviewReceipt error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
