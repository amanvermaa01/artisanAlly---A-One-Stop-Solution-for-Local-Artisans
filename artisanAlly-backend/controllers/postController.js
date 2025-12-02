import Post from "../models/Postmodel.js";
import User from "../models/User.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Get image URL from Cloudinary upload if file was uploaded
    const imageUrl = req.file ? req.file.path : null;

    const post = new Post({
      user: req.user._id,
      title,
      content,
      image: imageUrl,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Posts
export const getPosts = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    // If user is logged in, get their following list
    let followingList = [];
    if (userId) {
      const currentUser = await User.findById(userId).select('following');
      followingList = currentUser?.following || [];
    }

    // Get all posts with user details
    const posts = await Post.find()
      .populate("user", "name role profilePicture")
      .sort({ createdAt: -1 });

    // If user has following list, prioritize followed users' posts
    if (followingList.length > 0) {
      const followedPosts = posts.filter(post => 
        followingList.some(followedId => followedId.toString() === post.user._id.toString())
      );
      const otherPosts = posts.filter(post => 
        !followingList.some(followedId => followedId.toString() === post.user._id.toString())
      );
      
      // Return followed users' posts first, then others
      res.json([...followedPosts, ...otherPosts]);
    } else {
      res.json(posts);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "name role profilePicture"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only owner can update
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    
    // Update image if new file was uploaded, otherwise keep existing image
    if (req.file) {
      post.image = req.file.path;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only owner can delete
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Like/Unlike Post
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes, likesCount: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add Comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ message: "Comment cannot be empty" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user._id, text });
    await post.save();

    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
