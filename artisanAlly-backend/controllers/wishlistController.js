import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    // If no authenticated user, return empty wishlist instead of 401
    if (!req.user) {
      return res.json([]);
    }
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: "products",
      populate: {
        path: "artist",
        select: "name email",
      },
    });

    if (!wishlist) {
      // Create empty wishlist if doesn't exist
      wishlist = new Wishlist({
        user: req.user._id,
        products: [],
      });
      await wishlist.save();
    }

    res.json(wishlist.products);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Failed to get wishlist" });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId).populate("artist");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: [],
      });
    }

    // Check if product already in wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add product to wishlist
    wishlist.products.push(productId);
    wishlist.updatedAt = new Date();
    await wishlist.save();

    res.json({
      message: "Product added to wishlist",
      product: product,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    wishlist.updatedAt = new Date();
    await wishlist.save();

    res.json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};

// Check if product is in wishlist
export const checkWishlistStatus = async (req, res) => {
  try {
    const { productId } = req.params;

    // If unauthenticated, product is not in wishlist
    if (!req.user) {
      return res.json({ isInWishlist: false });
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const isInWishlist = wishlist
      ? wishlist.products.includes(productId)
      : false;

    res.json({ isInWishlist });
  } catch (error) {
    console.error("Check wishlist status error:", error);
    res.status(500).json({ message: "Failed to check wishlist status" });
  }
};
