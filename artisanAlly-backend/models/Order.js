// models/order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // Pending, Completed
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
