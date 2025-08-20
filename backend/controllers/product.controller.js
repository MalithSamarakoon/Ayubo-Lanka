import Product  from "../models/product.model.js";

export const createProduct = async (req, res) => {

    try {
        console.log("req.body:", req.body); // Debug line
        const { name, description, category, price, stock, minimumStock, image } = req.body;  //getting required information from request.
        const product = await Product.create({
            name,
            description,
            category,
            price,
            stock,
            minimumStock,
            image
        })

        res.status(201).json({ 
            message: "Product created successfully",
            product 
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getAllProducts = async (req, res) => {
      try {
        const products = await Product.find();
        res.status(200).json({
            message: "Products retrieved successfully",
            products
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
      }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        res.status(200).json({
            message: "Featured products retrieved successfully",
            featuredProducts
        });
    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProduct = async (req, res) => {
    
}