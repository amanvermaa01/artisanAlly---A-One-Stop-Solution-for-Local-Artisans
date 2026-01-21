// controllers/productController.js
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// Create a product (artist only)
export const createProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => file.path) : [];
    const product = new Product({ 
      ...req.body, 
      artist: req.user._id,
      images
    });
    await product.save();
    const populated = await product.populate("artist");
    res.json(populated);
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all products of an artist
export const getArtistProducts = async (req, res) => {
  try {
    const products = await Product.find({
      artist: req.params.artistId,
    }).populate("artist");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "artist"
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    // If user is logged in, get their following list
    let followingList = [];
    if (userId) {
      const currentUser = await User.findById(userId).select('following');
      followingList = currentUser?.following || [];
    }

    // Get all products with artist details
    let products = await Product.find().populate("artist");
    
    // Filter out products with missing artists
    products = products.filter(product => product.artist !== null);
    
    // If user has following list, prioritize followed artists' products
    if (followingList.length > 0) {
      const followedProducts = products.filter(product => 
        followingList.some(followedId => followedId.toString() === product.artist._id.toString())
      );
      const otherProducts = products.filter(product => 
        !followingList.some(followedId => followedId.toString() === product.artist._id.toString())
      );
      
      // Return followed artists' products first, then others
      res.json([...followedProducts, ...otherProducts]);
    } else {
      res.json(products);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.artist.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      req.body.images = newImages;
    }
    
    Object.assign(product, req.body);
    await product.save();
    const populated = await product.populate("artist");
    res.json(populated);
  } catch (err) {
    console.error('Product update error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.artist.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    await product.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buy a product
export const buyProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.stock <= 0)
      return res.status(400).json({ error: "Out of stock" });

    // Deduct stock
    product.stock -= 1;
    await product.save();

    // Create order
    const order = new Order({
      product: product._id,
      buyer: req.user._id,
      artist: product.artist,
      price: product.price,
    });
    await order.save();

    res.json({ message: "Purchase successful", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders of a user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate(
      "product artist"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
