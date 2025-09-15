import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

const ayurvedicproductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String, // Change to String for now
      required: false,
    },
    price: {
      type: Schema.Types.Mixed,
      required: true,
    },
    stock: {
      type: Schema.Types.Mixed,
       required: true
    },
    minimumStock: {
      type: Schema.Types.Mixed,
       required: true
    },

    image: {
      type: String,
       required: [true, "Image is required."]
    },

    isFeatured: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true }
);

const ayurvedicProduct = mongoose.model(
  "ayurvedicProduct",
  ayurvedicproductSchema
);

export default ayurvedicProduct;
