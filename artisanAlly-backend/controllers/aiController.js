import fetch from "node-fetch";
import * as VibrantModule from "node-vibrant/node";
const Vibrant = /** @type {any} */ (VibrantModule).default || VibrantModule;

// ======================
// 0. Trends (Frontend expects)
// ======================
export const getTrends = async (req, res) => {
  try {
    const { location = "global", productType = "art" } = req.query;
    
    // Dynamic trend generation based on location and product type
    const locationSpecificTrends = {
      'india': ['Traditional motifs fusion', 'Festive seasonal items', 'Regional craft revival'],
      'japan': ['Minimalist aesthetics', 'Zen-inspired designs', 'Nature-influenced patterns'],
      'mexico': ['Vibrant color palettes', 'Cultural storytelling', 'Folk art integration'],
      'italy': ['Renaissance-inspired pieces', 'Luxury craftsmanship', 'Artisanal heritage'],
      'usa': ['Industrial chic designs', 'Rustic farmhouse style', 'Personalized custom items'],
      'global': ['Cross-cultural fusion', 'Sustainable materials', 'Digital artisan marketplace']
    };
    
    const productTypeTrends = {
      'pottery': ['Glazing innovations', 'Functional art pieces', 'Earth-toned ceramics'],
      'textile': ['Natural fiber emphasis', 'Hand-woven techniques', 'Sustainable dyeing'],
      'jewelry': ['Statement pieces', 'Mixed metal designs', 'Ethical sourcing'],
      'woodwork': ['Live edge furniture', 'Reclaimed wood art', 'Carved decorative items'],
      'metalwork': ['Hammered textures', 'Industrial aesthetics', 'Mixed media sculptures'],
      'art': ['Abstract expressions', 'Mixed media art', 'Digital-traditional hybrids'],
      'handicraft': ['Heritage techniques', 'Modern applications', 'Sustainable practices']
    };
    
    const locationKey = location.toLowerCase();
    const productKey = productType.toLowerCase();
    
    const baseTrends = locationSpecificTrends[locationKey] || locationSpecificTrends['global'];
    const typeTrends = productTypeTrends[productKey] || productTypeTrends['art'];
    
    const trends = [
      `${productType} inspired by ${location} cultural heritage`,
      ...baseTrends.slice(0, 2),
      ...typeTrends.slice(0, 2)
    ];
    
    const locationInsights = {
      'india': 'Growing demand for authentic traditional crafts with modern appeal',
      'japan': 'Emphasis on mindful consumption and quality over quantity',
      'mexico': 'International appreciation for vibrant cultural expressions',
      'italy': 'Premium pricing for heritage craftsmanship and luxury materials',
      'usa': 'Strong market for personalized and locally-made products',
      'global': 'Cross-border appreciation for unique artisan stories'
    };
    
    const insights = [
      locationInsights[locationKey] || locationInsights['global'],
      `${productType} market shows 25% growth in handmade segment in ${location}`,
      `Consumers in ${location} value authenticity and sustainable production methods`
    ];
    
    const recommendations = [
      `Develop ${productType} collection highlighting ${location} artistic traditions`,
      `Partner with local artisans in ${location} for authentic ${productType} pieces`,
      `Create limited edition ${productType} series with ${location} cultural storytelling`,
      `Implement eco-friendly packaging for ${location} market preferences`
    ];
    
    res.json({ trends, insights, recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// 1. Caption Generator
// ======================
export const generateCaption = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!process.env.HF_API_KEY) {
      // Safe fallback when no HF key configured
      return res.json({
        caption: "A handcrafted artwork with warm tones and intricate details.",
      });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
        body: JSON.stringify({ inputs: imageUrl }),
      }
    );
    const data = await response.json();
    res.json({
      caption: data?.[0]?.generated_text || "Beautiful artisan product.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// 1b. Description (Frontend expects)
// ======================
export const generateDescription = async (req, res) => {
  try {
    const { name, keywords = [] } = req.body;
    
    // Enhanced dynamic description generation based on product name and keywords
    const generateDynamicDescription = () => {
      if (!name) return "A beautiful handcrafted piece made with attention to detail and traditional techniques.";
      
      const keywordText = keywords.length > 0 ? keywords.join(", ") : "premium materials";
      
      // Generate different descriptions based on product type (inferred from name)
      const productType = name.toLowerCase();
      let baseDescription = "";
      
      if (productType.includes('vase') || productType.includes('pot') || productType.includes('ceramic')) {
        baseDescription = `This exquisite ${name} showcases masterful ceramic artistry, featuring ${keywordText}. Each curve and glaze tells a story of traditional craftsmanship meeting contemporary design.`;
      } else if (productType.includes('jewelry') || productType.includes('ring') || productType.includes('necklace')) {
        baseDescription = `Elegantly crafted ${name} that captures attention with its ${keywordText}. This distinctive piece combines timeless elegance with modern sophistication.`;
      } else if (productType.includes('textile') || productType.includes('fabric') || productType.includes('cloth')) {
        baseDescription = `Beautifully woven ${name} showcasing traditional textile techniques enhanced by ${keywordText}. Each thread tells a story of heritage and contemporary style.`;
      } else if (productType.includes('wood') || productType.includes('furniture') || productType.includes('carved')) {
        baseDescription = `Skillfully carved ${name} highlighting the natural beauty of wood enhanced with ${keywordText}. This piece brings warmth and character to any space.`;
      } else {
        // Generic but still dynamic description
        const descriptors = ['exquisite', 'stunning', 'remarkable', 'captivating', 'extraordinary'];
        const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
        baseDescription = `This ${descriptor} ${name} represents the finest in artisanal craftsmanship, incorporating ${keywordText} with meticulous attention to detail.`;
      }
      
      const endings = [
        " Perfect for those who appreciate authentic handmade quality.",
        " An ideal choice for discerning collectors and gift-givers.",
        " A testament to the enduring appeal of handcrafted artistry.",
        " Designed to be treasured for generations to come.",
        " Each piece is unique, reflecting the artisan's individual touch."
      ];
      
      return baseDescription + endings[Math.floor(Math.random() * endings.length)];
    };
    
    // Dynamic tags based on keywords and product name
    const generateDynamicTags = () => {
      const baseTags = [...keywords, "handmade", "artisan"];
      const productName = name.toLowerCase();
      
      // Add relevant tags based on product name
      if (productName.includes('ceramic') || productName.includes('pottery')) baseTags.push('ceramic', 'pottery');
      if (productName.includes('wood')) baseTags.push('wooden', 'natural');
      if (productName.includes('metal')) baseTags.push('metalwork', 'crafted');
      if (productName.includes('textile')) baseTags.push('textile', 'woven');
      if (productName.includes('jewelry')) baseTags.push('jewelry', 'accessories');
      if (productName.includes('glass')) baseTags.push('glasswork', 'transparent');
      
      // Remove duplicates and limit to 6 tags
      return [...new Set(baseTags)].slice(0, 6);
    };
    
    // Dynamic marketing tips based on product type and keywords
    const generateDynamicTips = () => {
      const productName = name.toLowerCase();
      const tips = [];
      
      // Base tips
      tips.push("Share the making process with behind-the-scenes videos");
      tips.push("Use lifestyle photos with warm, natural lighting");
      
      // Product-specific tips
      if (productName.includes('ceramic') || productName.includes('pottery')) {
        tips.push("Highlight the firing process and glaze techniques");
        tips.push("Show functional uses in home settings");
      } else if (productName.includes('jewelry')) {
        tips.push("Feature close-up detail shots of craftsmanship");
        tips.push("Show the piece being worn in different occasions");
      } else if (productName.includes('textile')) {
        tips.push("Demonstrate the weaving or stitching techniques");
        tips.push("Show texture and pattern details in good lighting");
      } else {
        tips.push("Include care instructions and story cards");
        tips.push("Feature customer testimonials and reviews");
      }
      
      // Keyword-specific tips
      if (keywords.includes('sustainable') || keywords.includes('eco')) {
        tips.push("Emphasize eco-friendly materials and processes");
      }
      if (keywords.includes('traditional') || keywords.includes('heritage')) {
        tips.push("Share the cultural history behind the craft");
      }
      
      return tips.slice(0, 5);
    };
    
    // Always return dynamic generated content for now (since API requires payment)
    return res.json({
      description: generateDynamicDescription(),
      tags: generateDynamicTags(),
      marketingTips: generateDynamicTips(),
    });
    
    // AI API code (commented out due to payment requirement)
    /*

    const response = await fetch(
      process.env.AI_BASE_URL + "/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "anthropic/claude-3.5-sonnet",
          messages: [
            {
              role: "system",
              content:
                "You write concise product descriptions and marketing tips for handcrafted artisan products.",
            },
            {
              role: "user",
              content: `Write a warm, compelling 60-100 word description for a product named "${name}" using these keywords: ${keywords.join(
                ", "
              )}. Also return 5 short marketing tips and 6 concise SEO tags. Reply in JSON with keys description, tags, marketingTips only.`,
            },
          ],
        }),
      }
    );
    const data = await response.json();
    // Fallback if model returns plain text
    try {
      const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");
      return res.json({
        description: parsed.description || "",
        tags: parsed.tags || keywords,
        marketingTips: parsed.marketingTips || [],
      });
    } catch (_) {
      return res.json({
        description: data.choices?.[0]?.message?.content || "",
        tags: keywords,
        marketingTips: [],
      });
    }
    */
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// 2. Hashtag Generator
// ======================
export const generateHashtags = async (req, res) => {
  try {
    const { caption } = req.body;
    
    // Enhanced dynamic hashtag generation
    const generateDynamicHashtags = (text) => {
      if (!text) return "#artisan #handmade #craft #unique #creative";
      
      const words = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
      const hashtags = [];
      
      // Always include base artisan hashtags
      hashtags.push("#artisan", "#handmade");
      
      // Extract meaningful words from caption (skip common words)
      const skipWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'this', 'that', 'these', 'those'];
      const meaningfulWords = words.filter(word => 
        word.length > 2 && !skipWords.includes(word)
      ).slice(0, 6);
      
      // Add extracted words as hashtags
      meaningfulWords.forEach(word => {
        if (word.length > 2) hashtags.push(`#${word}`);
      });
      
      // Add context-specific hashtags based on content
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('ceramic') || lowerText.includes('pottery') || lowerText.includes('clay')) {
        hashtags.push('#ceramic', '#pottery', '#clayart');
      }
      if (lowerText.includes('wood') || lowerText.includes('carve') || lowerText.includes('lumber')) {
        hashtags.push('#woodwork', '#carved', '#naturalwood');
      }
      if (lowerText.includes('metal') || lowerText.includes('steel') || lowerText.includes('iron') || lowerText.includes('bronze')) {
        hashtags.push('#metalwork', '#forged', '#sculpture');
      }
      if (lowerText.includes('textile') || lowerText.includes('fabric') || lowerText.includes('woven') || lowerText.includes('thread')) {
        hashtags.push('#textile', '#woven', '#fabricart');
      }
      if (lowerText.includes('jewelry') || lowerText.includes('necklace') || lowerText.includes('ring') || lowerText.includes('bracelet')) {
        hashtags.push('#jewelry', '#accessories', '#handmadejewelry');
      }
      if (lowerText.includes('glass') || lowerText.includes('blown') || lowerText.includes('stained')) {
        hashtags.push('#glassart', '#glasswork', '#artglass');
      }
      if (lowerText.includes('paint') || lowerText.includes('canvas') || lowerText.includes('brush') || lowerText.includes('color')) {
        hashtags.push('#painting', '#artpainting', '#canvasart');
      }
      
      // Add quality/style hashtags based on descriptive words
      if (lowerText.includes('beautiful') || lowerText.includes('stunning') || lowerText.includes('gorgeous')) {
        hashtags.push('#beautiful', '#stunning');
      }
      if (lowerText.includes('unique') || lowerText.includes('special') || lowerText.includes('rare')) {
        hashtags.push('#unique', '#oneofakind');
      }
      if (lowerText.includes('traditional') || lowerText.includes('heritage') || lowerText.includes('ancient')) {
        hashtags.push('#traditional', '#heritage', '#culturalart');
      }
      if (lowerText.includes('modern') || lowerText.includes('contemporary') || lowerText.includes('innovative')) {
        hashtags.push('#modern', '#contemporary', '#innovativeart');
      }
      if (lowerText.includes('sustainable') || lowerText.includes('eco') || lowerText.includes('green') || lowerText.includes('natural')) {
        hashtags.push('#sustainable', '#ecofriendly', '#naturalart');
      }
      
      // Add general art hashtags
      hashtags.push('#art', '#craft', '#smallbusiness', '#supportlocal', '#buyhandmade');
      
      // Remove duplicates, limit to 12-15 hashtags, and join
      const uniqueHashtags = [...new Set(hashtags)].slice(0, 15);
      return uniqueHashtags.join(' ');
    };
    
    // Always use dynamic generation for development (API requires payment)
    return res.json({ hashtags: generateDynamicHashtags(caption) });

    /*
    // External API code (commented out for development)
    const response = await fetch(
      process.env.AI_BASE_URL + "/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "anthropic/claude-3.5-sonnet",
          messages: [
            {
              role: "system",
              content: "You are a social media hashtag generator.",
            },
            {
              role: "user",
              content: `Generate 10 trending hashtags for: ${caption}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json({
      hashtags: data.choices?.[0]?.message?.content || "#artisan #handmade",
    });
    */
  } catch (error) {
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
    
    // Generate dynamic mock search results based on query
    const generateQueryRelevantResults = (searchQuery) => {
      const queryLower = searchQuery.toLowerCase();
      const queryWords = queryLower.split(' ').filter(word => word.length > 2);
      
      // Define comprehensive product categories with relevant items
      const productCategories = {
        ceramic: [
          { name: "Blue Ceramic Vase", description: "Hand-thrown ceramic vase with cobalt blue glazing and traditional patterns", price: 65.00, artist: "Maya Chen" },
          { name: "Ceramic Dinner Set", description: "6-piece ceramic dinnerware with earthy tones and rustic finish", price: 120.00, artist: "David Potter" },
          { name: "Decorative Ceramic Bowl", description: "Large serving bowl with intricate ceramic work and natural glazes", price: 45.00, artist: "Elena Vasquez" }
        ],
        wood: [
          { name: "Carved Wooden Sculpture", description: "Hand-carved oak sculpture featuring abstract flowing forms", price: 180.00, artist: "Robert Carver" },
          { name: "Wooden Jewelry Box", description: "Handcrafted walnut jewelry box with velvet lining and brass hinges", price: 85.00, artist: "Anna Woodcraft" },
          { name: "Live Edge Coffee Table", description: "Natural edge walnut coffee table with steel hairpin legs", price: 450.00, artist: "Tom Woodworks" }
        ],
        textile: [
          { name: "Handwoven Wall Tapestry", description: "Geometric patterned tapestry woven with natural wool fibers", price: 220.00, artist: "Maria Tejedor" },
          { name: "Organic Cotton Throw", description: "Soft throw blanket made from organic cotton with traditional patterns", price: 95.00, artist: "Lisa Weaver" },
          { name: "Silk Scarf Collection", description: "Hand-painted silk scarves with botanical motifs and vibrant colors", price: 75.00, artist: "Sophie Silk" }
        ],
        jewelry: [
          { name: "Silver Statement Necklace", description: "Bold sterling silver necklace with geometric pendant and chain", price: 125.00, artist: "James Silversmith" },
          { name: "Handmade Copper Earrings", description: "Hammered copper earrings with turquoise stone accents", price: 45.00, artist: "Rachel Metals" },
          { name: "Gold Wire Wrapped Ring", description: "Delicate gold-filled ring with wire wrapping and semi-precious stones", price: 85.00, artist: "Alex Goldwork" }
        ],
        metal: [
          { name: "Forged Iron Wall Art", description: "Hand-forged iron sculpture with oxidized finish for wall mounting", price: 150.00, artist: "Mike Ironworks" },
          { name: "Bronze Garden Statue", description: "Small bronze statue perfect for garden or indoor display", price: 320.00, artist: "Catherine Bronze" },
          { name: "Steel Wind Chimes", description: "Musical wind chimes made from recycled steel with melodic tones", price: 65.00, artist: "Paul Steelcraft" }
        ],
        glass: [
          { name: "Blown Glass Vase", description: "Hand-blown glass vase with swirled colors and elegant form", price: 95.00, artist: "Crystal Blower" },
          { name: "Stained Glass Panel", description: "Decorative stained glass panel with floral design and vibrant colors", price: 180.00, artist: "Sarah Glassart" },
          { name: "Glass Ornament Set", description: "Set of 6 hand-blown glass ornaments with unique patterns", price: 55.00, artist: "Tim Glassman" }
        ],
        painting: [
          { name: "Abstract Acrylic Painting", description: "Large canvas painting with bold colors and expressive brushstrokes", price: 280.00, artist: "Nina Painter" },
          { name: "Watercolor Landscape", description: "Delicate watercolor painting of mountain landscape with soft tones", price: 120.00, artist: "Oliver Water" },
          { name: "Mixed Media Collage", description: "Contemporary mixed media artwork combining paint, paper, and texture", price: 200.00, artist: "Zoe Mixed" }
        ]
      };
      
      const posts = [
        { title: "The Art of Traditional Ceramics", content: "Exploring ancient ceramic techniques and their modern applications in contemporary art...", user: "Clay Master", views: 324 },
        { title: "Woodworking for Beginners", content: "Essential tools and techniques for starting your woodworking journey with basic projects...", user: "Wood Guru", views: 589 },
        { title: "Sustainable Textile Practices", content: "How modern artisans are incorporating eco-friendly materials and methods in textile arts...", user: "Eco Weaver", views: 412 },
        { title: "Metal Arts Renaissance", content: "The revival of traditional metalworking techniques in contemporary sculpture and design...", user: "Iron Artist", views: 276 },
        { title: "Color Theory in Glass Art", content: "Understanding how light and color interact in stained glass and blown glass artworks...", user: "Glass Guru", views: 198 },
        { title: "Mixed Media Innovations", content: "Pushing boundaries by combining traditional crafts with modern materials and techniques...", user: "Art Innovator", views: 445 }
      ];
      
      const users = [
        { name: "Alexandra Potter", bio: "Master ceramicist specializing in functional pottery and decorative vessels", role: "artisan", location: "Santa Fe, New Mexico" },
        { name: "Benjamin Woodcraft", bio: "Furniture maker and wood sculptor creating pieces from reclaimed and sustainable materials", role: "artisan", location: "Portland, Oregon" },
        { name: "Carmen Textiles", bio: "Traditional weaver preserving indigenous textile techniques while creating contemporary designs", role: "artisan", location: "Oaxaca, Mexico" },
        { name: "Daniel Metalwork", bio: "Blacksmith and metal sculptor forging functional art and architectural elements", role: "artisan", location: "Asheville, North Carolina" },
        { name: "Emma Glassworks", bio: "Stained glass artist and glass blower creating luminous artworks for homes and galleries", role: "artisan", location: "Venice, Italy" },
        { name: "Felix Painter", bio: "Contemporary artist working in mixed media and traditional painting techniques", role: "artisan", location: "Brooklyn, New York" }
      ];
      
      // Find relevant products based on query
      let relevantProducts = [];
      
      // Check each category for relevance
      Object.keys(productCategories).forEach(category => {
        if (queryWords.some(word => category.includes(word) || queryLower.includes(category))) {
          relevantProducts = relevantProducts.concat(
            productCategories[category].map((product, index) => ({
              _id: `product_${category}_${index}`,
              name: product.name,
              description: product.description,
              price: product.price,
              images: [`https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 100000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`],
              artist: { name: product.artist, profilePicture: null }
            }))
          );
        }
      });
      
      // If no specific category match, search by keywords in all products
      if (relevantProducts.length === 0) {
        Object.values(productCategories).flat().forEach((product, index) => {
          if (queryWords.some(word => 
            product.name.toLowerCase().includes(word) || 
            product.description.toLowerCase().includes(word)
          )) {
            relevantProducts.push({
              _id: `product_search_${index}`,
              name: product.name,
              description: product.description,
              price: product.price,
              images: [`https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 100000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`],
              artist: { name: product.artist, profilePicture: null }
            });
          }
        });
      }
      
      // Find relevant posts
      const relevantPosts = posts.filter(post => 
        queryWords.some(word => 
          post.title.toLowerCase().includes(word) || 
          post.content.toLowerCase().includes(word)
        )
      ).map((post, index) => ({
        _id: `post_${index}`,
        title: post.title,
        content: post.content,
        views: post.views,
        user: { name: post.user, profilePicture: null }
      }));
      
      // Find relevant users
      const relevantUsers = users.filter(user => 
        queryWords.some(word => 
          user.name.toLowerCase().includes(word) || 
          user.bio.toLowerCase().includes(word)
        )
      ).map((user, index) => ({
        _id: `user_${index}`,
        name: user.name,
        bio: user.bio,
        role: user.role,
        location: user.location,
        profilePicture: null
      }));
      
      return {
        products: relevantProducts.slice(0, 8), // Limit to 8 products
        posts: relevantPosts.slice(0, 5),       // Limit to 5 posts
        users: relevantUsers.slice(0, 6)        // Limit to 6 users
      };
    };
    
    const results = generateQueryRelevantResults(query);
    const { products: relevantProducts, posts: relevantPosts, users: relevantUsers } = results;
    
    res.json({ 
      products: relevantProducts, 
      posts: relevantPosts, 
      users: relevantUsers 
    });
  } catch (error) {
    console.error('Semantic search error:', error);
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
