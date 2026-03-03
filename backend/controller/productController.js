import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import { Wishlist } from "../models/wishlistModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import sharp from "sharp";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;

    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let productImg = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {

        // ✅ Reject non-image files
        if (!file.mimetype.startsWith("image/")) {
          return res.status(400).json({
            success: false,
            message: "Only image files are allowed",
          });
        }

        let quality = 80;
        let compressedBuffer;

        // ✅ Compress until file size < 2MB
        while (true) {
          compressedBuffer = await sharp(file.buffer, {
            animated: true, // supports gif
          })
            .webp({ quality }) // convert everything to webp
            .toBuffer();

          const sizeInMB = compressedBuffer.length / (1024 * 1024);

          if (sizeInMB <= 2 || quality <= 30) {
            break;
          }

          quality -= 10; // reduce quality gradually
        }

        // ✅ Upload compressed image to Cloudinary
        const fileUri = `data:image/webp;base64,${compressedBuffer.toString(
          "base64"
        )}`;

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });

        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // ✅ Create Product
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg,
    });

    return res.status(200).json({
      success: true,
      message: "Product Added Successfully",
      product: newProduct,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "no product avilable",
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 1. Delete images from Cloudinary
    if (product.productImg && product.productImg.length > 0) {
      for (let img of product.productImg) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // 2. Delete the product itself
    await Product.findByIdAndDelete(productId);

    // 3. CLEANUP: Remove product from all Carts
    // Finds any cart containing this productId and pulls it from the items array
    await Cart.updateMany(
      { "items.productId": productId },
      { $pull: { items: { productId: productId } } },
    );

    // 4. CLEANUP: Remove product from all Wishlists
    // Assuming wishlist stores an array of product IDs
    await Wishlist.updateMany(
      { "items.productId": productId }, // Find wishlists containing this product
      { $pull: { items: { productId: productId } } }, // Remove the specific object from the items array
    );

    return res.status(200).json({
      success: true,
      message:
        "Product and all related cart/wishlist entries deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let updatedImages = [];

    // keep selected old images
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);

      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );

      // delete removed images
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id),
      );

      for (const img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImages = [...product.productImg];
    }

    // upload new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });

        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // update product fields
    product.productName = productName ?? product.productName;
    product.productDesc = productDesc ?? product.productDesc;
    product.productPrice = productPrice ?? product.productPrice;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.productImg = updatedImages;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
