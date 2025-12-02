// controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const index = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );
    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get cart items
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      populate: { path: "artist", select: "name role" }
    });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Checkout cart
export const checkoutCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    // Create orders
    const orders = [];
    for (const item of cart.items) {
      if (item.product.stock < item.quantity)
        return res
          .status(400)
          .json({ error: `${item.product.name} is out of stock` });

      item.product.stock -= item.quantity;
      await item.product.save();

      const order = new Order({
        product: item.product._id,
        buyer: req.user._id,
        artist: item.product.artist,
        price: item.product.price * item.quantity,
      });
      await order.save();
      orders.push(order);
    }

    // Empty cart
    cart.items = [];
    await cart.save();

    res.json({ message: "Checkout successful", orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
