// routes/cartRoutes.js
import express from "express";
import { protect as authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  removeFromCart,
  getCart,
  checkoutCart,
  updateCartItemQuantity,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(authMiddleware); // All routes require login

router.post("/add", addToCart);
router.put("/update", updateCartItemQuantity);
router.delete("/remove/:productId", removeFromCart);
router.get("/", getCart);
router.post("/checkout", checkoutCart);

export default router;
