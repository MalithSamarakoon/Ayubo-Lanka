import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: "" },
    category: { type: String, default: "" },
    herbs: { type: [String], default: [] }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Product", productSchema);
