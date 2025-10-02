// backend/src/routes/orders.routes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isValidObjectId } from "mongoose";
import Order from "../models/Order.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Multer: save slips to uploads/slips ----------
const slipsRoot = path.join(__dirname, "..", "..", "uploads", "slips");
fs.mkdirSync(slipsRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, slipsRoot),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf", "image/jpg", "image/webp"];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Unsupported file type"));
  },
});

// ---------- Helpers ----------
function fail(res, code, message) {
  return res.status(code).json({ success: false, message });
}
function ok(res, payload = {}) {
  return res.json({ success: true, ...payload });
}
function basicValidateItemsShipping({ items, shipping }) {
  if (!Array.isArray(items) || items.length === 0) return "Items required";
  if (!shipping || typeof shipping !== "object") return "Shipping required";
  if (!shipping.name || !shipping.address) return "Shipping name & address required";
  return null;
}

// ---------- Create (COD) POST /api/orders ----------
router.post("/", async (req, res) => {
  try {
    const { items, shipping, payment, total } = req.body;

    const v = basicValidateItemsShipping({ items, shipping });
    if (v) return fail(res, 400, v);

    const doc = await Order.create({
      items,
      shipping,
      payment: payment || { method: "COD" },
      total: Number(total || 0),
      status: "PENDING",
    });

    return ok(res, { order: doc });
  } catch (e) {
    return fail(res, 500, e.message || "Server error");
  }
});

// ---------- Create (BANK_SLIP) POST /api/orders/with-slip ----------
router.post("/with-slip", upload.single("slip"), async (req, res) => {
  try {
    const items = JSON.parse(req.body.items || "[]");
    const shipping = JSON.parse(req.body.shipping || "{}");
    const payment = JSON.parse(req.body.payment || '{"method":"BANK_SLIP"}');
    const total = Number(req.body.total || 0);

    const v = basicValidateItemsShipping({ items, shipping });
    if (v) return fail(res, 400, v);
    if (!req.file) return fail(res, 400, "Slip file missing");

    const slipMeta = {
      diskPath: req.file.path,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    const doc = await Order.create({
      items,
      shipping,
      payment,
      total,
      status: "UNDER_REVIEW",
      slipMeta,
    });

    return ok(res, { order: doc });
  } catch (e) {
    return fail(res, 500, e.message || "Server error");
  }
});

// ---------- Read one GET /api/orders/:id ----------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return fail(res, 400, "Invalid order id");

    const order = await Order.findById(id);
    if (!order) return fail(res, 404, "Order not found");

    return ok(res, { order });
  } catch (e) {
    return fail(res, 500, e.message || "Server error");
  }
});

// ---------- Update (JSON or multipart) PUT /api/orders/:id ----------
router.put("/:id", upload.single("slip"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return fail(res, 400, "Invalid order id");

    let { items, shipping, payment, total, status } = req.body;

    // If multipart, JSON fields arrive as strings
    if (typeof items === "string") items = JSON.parse(items);
    if (typeof shipping === "string") shipping = JSON.parse(shipping);
    if (typeof payment === "string") payment = JSON.parse(payment);

    // If a new slip file arrives, force BANK_SLIP and attach slip metadata
    if (req.file) {
      payment = {
        ...(payment || {}),
        method: "BANK_SLIP",
        slipMeta: {
          diskPath: req.file.path,
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      };
    }

    const update = {};
    if (items) update.items = items;
    if (shipping) update.shipping = shipping;
    if (payment) update.payment = payment;
    if (status) update.status = status;

    if (typeof total !== "undefined") {
      update.total = Number(total) || 0;
    } else if (items) {
      update.total = (items || []).reduce(
        (s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0),
        0
      );
    }

    const order = await Order.findByIdAndUpdate(id, update, { new: true });
    if (!order) return fail(res, 404, "Order not found");

    return ok(res, { order });
  } catch (e) {
    return fail(res, 500, e.message || "Server error");
  }
});

// ---------- Update status only PATCH /api/orders/:id/status ----------
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!isValidObjectId(id)) return fail(res, 400, "Invalid order id");
    if (!status) return fail(res, 400, "Status required");

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return fail(res, 404, "Order not found");

    return ok(res, { order });
  } catch (e) {
    return fail(res, 500, e.message || "Server error");
  }
});

// ---------- Delete DELETE /api/orders/:id ----------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return fail(res, 400, "Invalid order id");

    const order = await Order.findByIdAndDelete(id);
    if (!order) return fail(res, 404, "Order not found");

    return ok(res, { message: "Deleted" });
  } catch (e) {
    return fail(res, 500, e.message || "Server error");
  }
});

// ---------- List GET /api/orders (?q=…) ----------
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;

    let filter = {};
    if (q && String(q).trim()) {
      const rx = new RegExp(String(q).trim(), "i");
      filter = {
        $or: [
          { "shipping.name": rx },
          { "shipping.telephone": rx },
          { "shipping.city": rx },
          { "shipping.district": rx },
        ],
      };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200);
    return ok(res, { orders });
  } catch (e) {
    return fail(res, 500, e.message || "Server error");
  }
});

export default router;
