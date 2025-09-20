import ayurvedicProduct from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

// Validation helper functions
const validateProductData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push("Product name must be at least 2 characters");
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  }
  
  if (!data.category) {
    errors.push("Category is required");
  }
  
  const price = Number(data.price);
  if (isNaN(price) || price < 0) {
    errors.push("Price must be a valid positive number");
  }
  
  const stock = Number(data.stock);
  if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.push("Stock must be a valid non-negative integer");
  }
  
  const minimumStock = Number(data.minimumStock);
  if (isNaN(minimumStock) || minimumStock < 0 || !Number.isInteger(minimumStock)) {
    errors.push("Minimum stock must be a valid non-negative integer");
  }
  
  if (minimumStock > stock) {
    errors.push("Minimum stock cannot be greater than current stock");
  }
  
  return errors;
};

const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, minimumStock, image, isFeatured } = req.body;

    // Validate input data
    const validationErrors = validateProductData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors
      });
    }

    if (!image) {
      return res.status(400).json({
        message: "Product image is required"
      });
    }

    let cloudinaryResponse = null;
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    } catch (uploadError) {
      return res.status(400).json({
        message: "Image upload failed",
        error: uploadError.message
      });
    }

    const saveProduct = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      minimumStock: Number(minimumStock),
      image: cloudinaryResponse.secure_url,
      isFeatured: Boolean(isFeatured),
    };

    const product = await ayurvedicProduct.create(saveProduct);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors
      });
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!validateObjectId(id)) {
      return res.status(400).json({ 
        message: "Invalid product ID format" 
      });
    }
    
    const product = await ayurvedicProduct.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      price,
      stock,
      minimumStock,
      image,
      isFeatured,
    } = req.body;

    // First, find the existing product
    const existingProduct = await ayurvedicProduct.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = existingProduct.image; // Keep existing image by default

    // Handle image update if a new image is provided
    if (image) {
      // Delete the old image from Cloudinary if it exists
      if (existingProduct.image) {
        const publicId = existingProduct.image.split("/").pop().split(".")[0]; // Extract public ID from URL
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log("Old image deleted from Cloudinary");
        } catch (error) {
          console.log(
            "Error deleting old image from Cloudinary:",
            error.message
          );
        }
      }

      // Upload the new image to Cloudinary
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
        imageUrl = cloudinaryResponse.secure_url;
        console.log("New image uploaded to Cloudinary");
      } catch (error) {
        console.error("Error uploading new image to Cloudinary:", error);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    // Update the product with the new data
    const updatedProduct = await ayurvedicProduct.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        price: price ? Number(price) : 0,
        stock: stock ? Number(stock) : 0,
        minimumStock: minimumStock ? Number(minimumStock) : 0,
        image: imageUrl,
        isFeatured,
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!validateObjectId(id)) {
      return res.status(400).json({ 
        message: "Invalid product ID format" 
      });
    }
    
    const product = await ayurvedicProduct.findById(id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      
      res.json({ updatedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!validateObjectId(id)) {
      return res.status(400).json({ 
        message: "Invalid product ID format" 
      });
    }
    
    const product = await ayurvedicProduct.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      //Delete image from cloudinary
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from Cloudinary");
      } catch (error) {
        console.log("Error deleting image from Cloudinary", error.message);
      }
    }

    await ayurvedicProduct.findByIdAndDelete(id);
    
    res.status(200).json({ 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Keep your existing getAllProducts and getFeaturedProducts methods unchanged

export const getAllProducts = async (req, res) => {
  try {
    const products = await ayurvedicProduct.find();
    res.status(200).json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await ayurvedicProduct.find({ isFeatured: true }).lean();
    res.status(200).json({
      message: "Featured products retrieved successfully",
      featuredProducts,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

