import fetch from "node-fetch";
import * as VibrantModule from "node-vibrant/node";
import { getLLM } from "../config/aiConfig.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const Vibrant = /** @type {any} */ (VibrantModule).default || VibrantModule;

// ======================
// 0. Trends (Frontend expects)
// ======================
export const getTrends = async (req, res) => {
  console.log("DEBUG: HIT getTrends endpoint");
  try {
    const { location = "global", productType = "art" } = req.query;
    const llm = getLLM();
    
    const response = await llm.invoke([
      new SystemMessage("You are a market trend analyst for local artisans."),
      new HumanMessage(`Identify 5-7 current market trends, 3 industrial insights, and 4 actionable recommendations for the "${productType}" industry in "${location}". Return the result in valid JSON format with keys: trends (array of strings), insights (array of strings), and recommendations (array of strings). Do not include any other text.`)
    ]);

    let content = response.content;
    if (typeof content === 'string') {
      content = content.replace(/```json|```/g, "").trim();
    }
    
    const data = JSON.parse(content);
    res.json(data);
  } catch (error) {
    console.error("Trends Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ======================
// 1. Caption Generator
// ======================
export const generateCaption = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const llm = getLLM();

    // Since LangChain's getLLM might return ChatOpenAI or ChatGoogleGenerativeAI
    // and both support vision via different formats, we'll use a descriptive prompt.
    // However, Gemini Flash 2.0 is great at this.
    
    const response = await llm.invoke([
      new SystemMessage("You are an expert art critic."),
      new HumanMessage([
        {
          type: "text",
          text: "Describe this artisan product in one poetic sentence.",
        },
        {
          type: "image_url",
          image_url: { url: imageUrl },
        },
      ]),
    ]);

    res.json({
      caption: response.content.trim() || "A beautiful handcrafted masterpiece.",
    });
  } catch (error) {
    console.error("Caption Error:", error);
    // Fallback to simple caption if vision fails or provider doesn't support it
    res.json({ caption: "A handcrafted artwork with warm tones and intricate details." });
  }
};

// ======================
// 1b. Description (Frontend expects)
// ======================
export const generateDescription = async (req, res) => {
  try {
    const { name, keywords = [] } = req.body;
    const llm = getLLM();

    const response = await llm.invoke([
      new SystemMessage("You are a creative writer for an artisan marketplace."),
      new HumanMessage(`Write a warm, compelling 60-100 word description for a handcrafted product named "${name}" using these keywords: ${keywords.join(", ")}. Also return 5 short marketing tips and 6 concise SEO tags. Reply in valid JSON format with keys: description, tags (array of strings), marketingTips (array of strings). Do not include any other text.`)
    ]);

    let content = response.content;
    if (typeof content === 'string') {
      content = content.replace(/```json|```/g, "").trim();
    }
    
    const data = JSON.parse(content);
    res.json(data);
  } catch (error) {
    console.error("Description Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ======================
// 2. Hashtag Generator
// ======================
export const generateHashtags = async (req, res) => {
  try {
    const { caption } = req.body;
    const llm = getLLM();

    const response = await llm.invoke([
      new SystemMessage("You are a social media expert for artisans."),
      new HumanMessage(`Generate 10 trending and relevant hashtags for an artisan product with this caption: "${caption}". Return only the hashtags separated by spaces.`)
    ]);

    res.json({ hashtags: response.content.trim() });
  } catch (error) {
    console.error("Hashtag Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ======================
// 3. Color Palette Extractor
// ======================
export const extractColors = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const palette = await Vibrant.from(imageUrl).getPalette();
    res.json({
      colors: Object.values(palette).map((c) => c.getHex()),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// 3b. Image Tags (Frontend expects)
// ======================
export const getImageTags = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }
    
    try {
      const palette = await Vibrant.from(imageUrl).getPalette();
      const tags = Object.values(palette).map((c) => c?.getHex()).filter(Boolean);
      const confidence = tags.map(() => 0.9);
      res.json({ tags, confidence });
    } catch (vibrantError) {
      // Fallback with generic color tags if vibrant fails
      console.log("Vibrant error:", vibrantError.message);
      res.json({ 
        tags: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"], 
        confidence: [0.8, 0.8, 0.8, 0.8, 0.8] 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// 4. Artwork Recommender
// ======================
export const getArtworkRecommendations = async (req, res) => {
  try {
    const { query } = req.body;
    if (!process.env.HF_API_KEY) {
      return res.json({ embedding: [0.1, 0.2, 0.3] });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
        body: JSON.stringify({ inputs: query }),
      }
    );
    const embedding = await response.json();

    // ⚡ Here you would compare embeddings with stored ones in MongoDB
    // Right now we just return the embedding vector
    res.json({ embedding });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// 4b. Semantic Search (Frontend expects)
// ======================
export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim() === '') {
      return res.json({ products: [], posts: [], users: [] });
    }

    const llm = getLLM();
    const response = await llm.invoke([
      new SystemMessage("You are an intelligent search assistant for an artisan marketplace."),
      new HumanMessage(`For the search query "${query}", generate 3-5 mock product results, 2-3 mock community posts, and 2-3 mock artisan users. Return the result in valid JSON format with keys: products (array of objects with _id, name, description, price, images, artist), posts (array of objects with _id, title, content, views, user), users (array of objects with _id, name, bio, role, location). Ensure the results are highly relevant to the query.`)
    ]);

    let content = response.content;
    if (typeof content === 'string') {
      content = content.replace(/```json|```/g, "").trim();
    }
    
    const data = JSON.parse(content);
    res.json(data);
  } catch (error) {
    console.error("Semantic Search Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ======================
// 5. Virtual Try-on (AI Mockup)
// ======================
export const tryOnArtwork = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!process.env.HF_API_KEY) {
      // Return a 1x1 transparent PNG when not configured
      const transparentPng = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAqMBi6yQmRwAAAAASUVORK5CYII=",
        "base64"
      );
      res.set("Content-Type", "image/png");
      return res.send(transparentPng);
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const buffer = await response.arrayBuffer();
    res.set("Content-Type", "image/png");
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
