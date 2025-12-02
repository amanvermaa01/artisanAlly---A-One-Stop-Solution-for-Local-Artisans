import User from "../models/User.js";
import Post from "../models/Postmodel.js";

// Auto-redirect based on user role with followers, views analytics, category & search
export const getDashboard = async (req, res) => {
  try {
    const { category, search } = req.query;

    // 🔎 Build filter for user search
    let userFilter = {};
    if (category) {
      userFilter.category = category; // filter by category
    }
    if (search) {
      userFilter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (req.user.role === "artisan") {
      // Fetch artisan profile with followers/following
      const artisan = await User.findById(req.user.id)
        .populate("followers", "name profilePicture category")
        .populate("following", "name profilePicture category");

      if (!artisan) {
        return res.status(404).json({ message: "Artisan not found" });
      }

      // Fetch artisan's own posts
      const posts = await Post.find({ user: req.user.id })
        .populate("user", "name role profilePicture category")
        .lean();

      // Analytics
      const totalFollowers = artisan.followers.length;
      const totalFollowing = artisan.following.length;
      const totalPosts = posts.length;
      const totalLikes = posts.reduce(
        (acc, post) => acc + (post.likes?.length || 0),
        0
      );
      const totalViews = posts.reduce(
        (acc, post) => acc + (post.views || 0),
        0
      );

      // Fetch users (all roles) based on filters
      const users = await User.find(userFilter).select("-password");

      return res.json({
        dashboard: "Artisan",
        analytics: {
          totalFollowers,
          totalFollowing,
          totalPosts,
          totalLikes,
          totalViews,
        },
        posts,
        followers: artisan.followers,
        following: artisan.following,
        users, // other users artisans can discover
      });
    }

    if (req.user.role === "customer") {
      // Customers can only see artisans (filtered)
      const artisans = await User.find({
        role: "artisan",
        ...userFilter,
      }).select("-password");

      // Fetch posts by these artisans
      const posts = await Post.find()
        .populate("user", "name role profilePicture category")
        .where("user")
        .in(artisans.map((a) => a._id));

      return res.json({
        dashboard: "Customer",
        artisans,
        posts,
      });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
