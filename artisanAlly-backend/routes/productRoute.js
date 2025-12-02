// routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getAllProducts,
  getArtistProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  buyProduct,
  getUserOrders,
} from "../controllers/productController.js";
import { protect as authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/cloudinaryMiddleware.js";

const router = express.Router();

// Products CRUD
router.post("/", authMiddleware, upload.array('images', 5), createProduct); // Only artist can create, allow up to 5 images
router.get("/", getAllProducts);
router.get("/artist/:artistId", getArtistProducts);
router.get("/:productId", getProduct);
router.put("/:productId", authMiddleware, upload.array('images', 5), updateProduct);
router.delete("/:productId", authMiddleware, deleteProduct);

// Buy product
router.post("/buy/:productId", authMiddleware, buyProduct);

// Get user's orders
router.get("/orders/me", authMiddleware, getUserOrders);

export default router;
