import ayurvedicProduct from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saveBase64ToLocal = async (dataUri) => {
  try {
    if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:')) return null;
    const [meta, base64] = dataUri.split(',');
    if (!base64) return null;
    const mimeMatch = /data:(.*?);base64/.exec(meta || '');
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const ext = mime === 'image/jpeg' || mime === 'image/jpg' ? '.jpg'
              : mime === 'image/gif' ? '.gif'
              : mime === 'image/webp' ? '.webp'
              : '.png';
    const buf = Buffer.from(base64, 'base64');
    const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const filename = `prod-${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`;
    const abs = path.join(uploadDir, filename);
    await fs.promises.writeFile(abs, buf);
    // return public path served by server static
    return `/uploads/products/${filename}`;
  } catch (e) {
    console.error('Local save failed:', e?.message || e);
    return null;
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log("createProduct req.body keys:", Object.keys(req.body || {}));
    const { name, description, category, price, stock, minimumStock, image, isFeatured } =
      req.body; //getting required information from request.

    let imageUrl = null;
    if (image) {
      const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
      if (hasCloudinary) {
        try {
          const resp = await cloudinary.uploader.upload(image, { folder: 'products' });
          imageUrl = resp?.secure_url || null;
        } catch (err) {
          console.error('Cloudinary upload failed:', err?.message || err);
          imageUrl = await saveBase64ToLocal(image);
        }
      } else {
        imageUrl = await saveBase64ToLocal(image);
      }
    }

    const saveProduct = {
      name,
      description,
      category,
      price : price ? Number(price) : 0,
      stock : stock ? Number(stock) : 0,
      minimumStock : minimumStock ? Number(minimumStock) : 0,
      image: imageUrl,
      isFeatured: isFeatured ? Boolean(isFeatured) : false,
    }

    const product = await ayurvedicProduct.create(saveProduct);

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    const msg = error?.message || 'Internal server error';
    res.status(500).json({ message: msg });
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
      // return a consistent shape used elsewhere
      res.json({ message: 'Product featured status updated', product: updatedProduct });
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
      // Clean up previous asset
      if (existingProduct.image) {
        if (existingProduct.image.startsWith('/uploads/products/')) {
          const oldName = existingProduct.image.replace('/uploads/products/', '');
          const oldAbs = path.join(__dirname, '..', 'uploads', 'products', oldName);
          try { await fs.promises.unlink(oldAbs); } catch {}
        } else {
          // try cloudinary destroy if it was a cloudinary URL
          try {
            const publicId = existingProduct.image.split('/').pop()?.split('.')?.[0];
            if (publicId) await cloudinary.uploader.destroy(`products/${publicId}`);
          } catch (err) {
            console.log('Cloudinary destroy failed (ok to ignore):', err?.message || err);
          }
        }
      }

      // Upload new image
      const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
      if (hasCloudinary) {
        try {
          const resp = await cloudinary.uploader.upload(image, { folder: 'products' });
          imageUrl = resp?.secure_url || null;
        } catch (err) {
          console.error('Cloudinary upload failed:', err?.message || err);
          imageUrl = await saveBase64ToLocal(image);
        }
      } else {
        imageUrl = await saveBase64ToLocal(image);
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
      // if local file path like /uploads/products/...
      if (typeof product.image === 'string' && product.image.startsWith('/uploads/products/')) {
        const filename = product.image.replace('/uploads/products/', '');
        const abs = path.join(__dirname, '..', 'uploads', 'products', filename);
        try { await fs.promises.unlink(abs); } catch (_) { /* ignore */ }
      } else {
        // Try deleting from Cloudinary if it was a cloud URL
        try {
          const publicId = product.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (error) {
          console.log("Error deleting image from Cloudinary", error.message);
        }
      }
    }

    await ayurvedicProduct.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
