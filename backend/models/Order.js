import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    id: { type: String },                    // optional client-side ID
    name: { type: String, required: true },  // item name required
    image: { type: String },
    qty: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const ShippingSchema = new mongoose.Schema(
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

const PaymentSchema = new mongoose.Schema(
  {
    method: { type: String, enum: ["COD", "BANK_SLIP"], required: true },
    receiptId: { type: String },     // optional linkage to another collection
    slipUrl: { type: String },       // if you later serve a public URL
    slipFileName: { type: String },  // legacy support if you store just a name
    // richer metadata when using multer (optional)
    slipMeta: {
      diskPath: String,
      filename: String,
      originalname: String,
      mimetype: String,
      size: Number,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    items: {
      type: [ItemSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one item is required",
      },
    },
    shipping: { type: ShippingSchema, required: true },
    payment: { type: PaymentSchema, required: true },
    total: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      // 👇 include UNDER_REVIEW to match your /with-slip route
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"],
      default: "PENDING",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
