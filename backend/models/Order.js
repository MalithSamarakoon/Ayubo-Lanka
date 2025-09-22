import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    image: String,
    qty: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, enum: ["COD", "BANK_SLIP"], required: true },
    receiptId: { type: String }, // optional if you ever add a receipts collection
    slipUrl: { type: String },   // file URL when BANK_SLIP
    slipFileName: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: { type: [itemSchema], default: [] },
    shipping: { type: shippingSchema, required: true },
    payment: { type: paymentSchema, required: true },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
