import User from "../models/User.js";
import Post from "../models/Postmodel.js";
import Order from "../models/Order.js";

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

      // Fetch artisan's orders
      const orders = await Order.find({ artist: req.user.id })
        .populate("buyer", "name profilePicture email")
        .populate("product", "name price images")
        .sort({ createdAt: -1 });

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
      
      // Financial Analytics
      const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);
      const totalOrders = orders.length;
      const recentOrders = orders.slice(0, 5);

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
          totalRevenue,
          totalOrders,
          recentOrders,
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
        
      // Fetch customer's orders
      const orders = await Order.find({ buyer: req.user.id })
        .populate("artist", "name profilePicture category")
        .populate("product", "name price images")
        .sort({ createdAt: -1 });
        
      // Customer Analytics
      const totalSpent = orders.reduce((acc, order) => acc + order.price, 0);
      const ordersPlaced = orders.length;
      const recentOrders = orders.slice(0, 5);

      return res.json({
        dashboard: "Customer",
        artisans,
        posts,
        analytics: {
          totalSpent,
          ordersPlaced,
          recentOrders
        }
      });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
