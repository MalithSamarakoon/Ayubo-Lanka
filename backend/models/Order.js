import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,                      // copy of name at purchase time
    price: { type: Number, required: true, min: 0 }, // price snapshot
    qty: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    items: { type: [orderItemSchema], default: [] },
    totals: {
      subtotal: { type: Number, required: true, min: 0 },
      tax: { type: Number, required: true, min: 0, default: 0 },
      shipping: { type: Number, required: true, min: 0, default: 0 },
      grandTotal: { type: Number, required: true, min: 0 }
    },
    status: { type: String, enum: ["pending", "processing", "completed", "cancelled"], default: "pending" },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    address: {
      name: String,
      phone: String,
      line1: String,
      city: String,
      country: String
    }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Order", orderSchema);
