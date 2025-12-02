import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { followUser, unfollowUser, getFollowStatus } from "../controllers/followController.js";

const router = express.Router();

// Get follow status
router.get("/:id/status", protect, getFollowStatus);

// Follow a user
router.post("/:id/follow", protect, followUser);

// Unfollow a user
router.post("/:id/unfollow", protect, unfollowUser);

export default router;
