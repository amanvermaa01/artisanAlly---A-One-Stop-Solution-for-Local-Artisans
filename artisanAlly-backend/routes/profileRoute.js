import express from "express";
import {
  followUser,
  getUserProfile,
  unfollowUser,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public profile (no need to be logged in, but can be protected if required)
router.get("/:id", protect, getUserProfile);

// Follow/unfollow (requires login)
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

export default router;
