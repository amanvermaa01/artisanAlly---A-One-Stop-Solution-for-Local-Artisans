import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
} from "../controllers/wishlistController.js";
import {
  protect as authMiddleware,
  optional as optionalAuth,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Allow unauthenticated GETs (they'll get an empty wishlist), but require
// authentication for mutating endpoints (add/remove).

// Get user's wishlist (optional auth)
router.get("/", optionalAuth, getWishlist);

// Add product to wishlist (requires auth)
router.post("/add", authMiddleware, addToWishlist);

// Remove product from wishlist (requires auth)
router.delete("/remove/:productId", authMiddleware, removeFromWishlist);

// Check if product is in wishlist (optional auth)
router.get("/check/:productId", optionalAuth, checkWishlistStatus);

export default router;
