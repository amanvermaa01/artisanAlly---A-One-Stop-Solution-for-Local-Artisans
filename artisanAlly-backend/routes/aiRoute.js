import express from "express";
import {
  getTrends,
  generateCaption,
  generateDescription,
  generateHashtags,
  extractColors,
  getImageTags,
  getArtworkRecommendations,
  semanticSearch,
  tryOnArtwork,
} from "../controllers/aiController.js";

const router = express.Router();

// Artist AI Features
router.get("/trends", getTrends);
router.post("/caption", generateCaption); // Generate caption from image
router.post("/description", generateDescription); // Generate product description
router.post("/hashtags", generateHashtags); // Generate hashtags from caption
router.post("/colors", extractColors); // Extract color palette
router.post("/image-tags", getImageTags); // Extract simple tags

// Customer AI Features
router.post("/recommend", getArtworkRecommendations); // Recommend artworks
router.post("/search", semanticSearch); // Semantic search
router.post("/tryon", tryOnArtwork); // Virtual try-on

export default router;
