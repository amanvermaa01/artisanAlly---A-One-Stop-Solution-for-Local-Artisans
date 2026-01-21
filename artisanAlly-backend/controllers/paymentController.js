// controllers/paymentController.js
import Stripe from "stripe";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

// Create Stripe Checkout session
export const createCheckoutSession = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    // Prepare line items
    const line_items = cart.items
      .filter((item) => item.product) // Defensive check for missing products
      .map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.product.name,
            images: item.product.images?.length > 0 ? [item.product.images[0]] : [],
          },
          unit_amount: Math.round(item.product.price * 100), // Stripe expects amount in paise
        },
        quantity: item.quantity,
      }));

    if (line_items.length === 0) {
      return res.status(400).json({ error: "No valid products in cart" });
    }

    // Ensure frontend URL doesn't have double slashes
    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, "");

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontendUrl}/cart?success=true`,
      cancel_url: `${frontendUrl}/cart?canceled=true`,
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    res.status(500).json({ error: err.message });
  }
};
