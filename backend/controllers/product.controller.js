import ayurvedicProduct from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { name, description, category, price, stock, minimumStock, image } =
      req.body; //getting required information from request.

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const saveProduct = {
      name,
      description,
      category,
      price : price ? Number(price) : 0,
      stock : stock ? Number(stock) : 0,
      minimumStock : minimumStock ? Number(minimumStock) : 0,
      image: cloudinaryResponse ? cloudinaryResponse.secure_url : null,
    }

    const product = await ayurvedicProduct.create(saveProduct);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
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


export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await ayurvedicProduct.findById(req.params.id);
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


export const deleteProduct = async (req, res) => {
  try {
    const product = await ayurvedicProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      //Delete image from cloudinary
      const publicId = product.image.split("/").pop().split(".")[0]; // Extract public ID from URL
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from Cloudinary");
      } catch (error) {
        console.log("Error deleting image from Cloudinary", error.message);
      }
    }

    await ayurvedicProduct.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
