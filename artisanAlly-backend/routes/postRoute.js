import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/cloudinaryMiddleware.js";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", protect, upload.single('image'), createPost);
router.get("/", getPosts); // get all posts
router.get("/:id", getPostById); // get single post
router.put("/:id", protect, upload.single('image'), updatePost);
router.delete("/:id", protect, deletePost); // delete post

router.post("/:id/like", protect, toggleLikePost); // like/unlike post
router.post("/:id/comment", protect, addComment); // add comment
export default router;
