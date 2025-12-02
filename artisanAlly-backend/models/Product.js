// models/product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 1 },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  aiStory: { type: String },
});

export default mongoose.model("Product", productSchema);
