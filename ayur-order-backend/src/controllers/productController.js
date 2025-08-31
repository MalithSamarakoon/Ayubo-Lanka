import Product from "../models/Product.js";

/** CREATE */
export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const priceNum = Number(price);
    if (!name || Number.isNaN(priceNum)) {
      return res.status(400).json({ message: "name and numeric price are required" });
    }
    const product = await Product.create({ ...req.body, price: priceNum });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** LIST (pagination + optional search q) */
export const listProducts = async (req, res) => {
  try {
    const page  = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const q = (req.query.q || "").trim();

    const filter = q
      ? { $or: [{ name: new RegExp(q, "i") }, { category: new RegExp(q, "i") }] }
      : {};

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Product.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** GET single */
export const getProduct = async (req, res) => {
  try {
    const doc = await Product.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Product not found" });
    res.json(doc);
  } catch {
    res.status(400).json({ message: "Invalid id" });
  }
};

/** UPDATE (PUT – full) */
export const updateProduct = async (req, res) => {
  try {
    if (req.body.price !== undefined) req.body.price = Number(req.body.price);
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    if (err?.name === "CastError") return res.status(400).json({ message: "Invalid id" });
    res.status(400).json({ message: err.message });
  }
};

/** UPDATE (PATCH – partial) */
export const patchProduct = async (req, res) => {
  try {
    if (req.body.price !== undefined) req.body.price = Number(req.body.price);
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    if (err?.name === "CastError") return res.status(400).json({ message: "Invalid id" });
    res.status(400).json({ message: err.message });
  }
};

/** DELETE */
export const deleteProduct = async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Product not found" });
    res.status(204).send();
  } catch {
    res.status(400).json({ message: "Invalid id" });
  }
};
