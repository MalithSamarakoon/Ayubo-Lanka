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