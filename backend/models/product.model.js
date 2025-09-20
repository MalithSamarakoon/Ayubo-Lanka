import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

const ayurvedicproductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"]
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: ["Kasthausadhi", "Rasaushadhi", "Jangama", "Kwatha", "Kalka"],
        message: "Category must be one of: kasthausadhi, rasaushadhi, jangama, kwatha, or kalka"
      }
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [10000, "Price cannot exceed 10,000"],
      validate: {
        validator: function(value) {
          return Number.isFinite(value) && value >= 0;
        },
        message: "Price must be a valid positive number"
      }
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number"
      }
    },
    minimumStock: {
      type: Number,
      required: [true, "Minimum stock is required"],
      min: [0, "Minimum stock cannot be negative"],
      validate: [
        {
          validator: Number.isInteger,
          message: "Minimum stock must be a whole number"
        },
        {
          validator: function(value) {
            return value <= this.stock;
          },
          message: "Minimum stock cannot be greater than current stock"
        }
      ]
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
      validate: {
        validator: function(value) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(value);
        },
        message: "Image must be a valid URL with jpg, jpeg, png, or webp extension"
      }
    },
    isFeatured: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  { timestamps: true }
);

// Add compound validation
ayurvedicproductSchema.pre('save', function(next) {
  if (this.minimumStock > this.stock) {
    next(new Error('Minimum stock cannot be greater than current stock'));
  }
  next();
});

const ayurvedicProduct = mongoose.model(
  "ayurvedicProduct",
  ayurvedicproductSchema
);

export default ayurvedicProduct;
