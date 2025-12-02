import express from "express";
import {
  getAllUsers,
  getArtisans,
  updateProfile,
  searchUsers,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/cloudinaryMiddleware.js";

const router = express.Router();

// Update profile
router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "backgroundPhoto", maxCount: 1 },
  ]),
  updateProfile
);

// Get artisans (open to all)
router.get("/artisans", getArtisans);

// Get all users (only artisans can see)
router.get("/all", protect, getAllUsers);

// 🔍 Search users by category, name, or location
router.get("/search", protect, searchUsers);

export default router;
