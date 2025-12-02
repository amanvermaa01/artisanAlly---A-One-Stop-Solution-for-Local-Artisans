// routes/paymentRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createCheckoutSession } from "../controllers/paymentController.js";

const router = express.Router();
router.post("/create", protect, createCheckoutSession);

export default router;
