import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: ObjectId,
        ref: "Category"
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    minimumStock: {
        type: Number,
        required: true
    },
    
    image: {
        type: String,
        required: [true, "Image is required."]
    }
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

export default Product;