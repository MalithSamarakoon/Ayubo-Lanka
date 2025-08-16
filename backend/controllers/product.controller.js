import Product  from "../models/product.model.js";

export const createProduct = async (req, res) => {

    try {
        const {name, description, category, price, stock, minimumStock} = req.body;
    } catch (error) {
        
    }
}