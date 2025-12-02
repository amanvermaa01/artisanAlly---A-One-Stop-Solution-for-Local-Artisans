import User from "../models/User.js";
import Post from "../models/Postmodel.js";
import Product from "../models/Product.js";

// Get public profile of a user
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUserId = req.user?.id;

    const user = await User.findById(userId)
      .select("-password") // hide password
      .populate("followers", "name profilePicture role")
      .populate("following", "name profilePicture role");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch user posts
    const posts = await Post.find({ user: userId })
      .populate("user", "name role profilePicture")
      .lean();
      
    // Fetch user products (if artisan)
    let products = [];
    if (user.role === 'artisan') {
      products = await Product.find({ artist: userId })
        .populate("artist", "name role profilePicture")
        .lean();
    }

    let isFollowing = false;
    if (loggedInUserId) {
      isFollowing = user.followers.some(
        (follower) => follower._id.toString() === loggedInUserId
      );
    }

    // Build response  
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        category: user.category,
        profilePicture: user.profilePicture,
        backgroundPhoto: user.backgroundPhoto,
        location: user.location,
        gender: user.gender,
        mobile: user.mobile,
        followers: user.followers,
        following: user.following,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      posts,
      products,
      stats: {
        totalFollowers: user.followers.length,
        totalFollowing: user.following.length,
        totalPosts: posts.length,
        totalProducts: products.length,
        totalLikes: posts.reduce(
          (acc, post) => acc + (post.likes?.length || 0),
          0
        ),
        totalViews: posts.reduce((acc, post) => acc + (post.views || 0), 0),
      },
      isFollowing
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Follow user
export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id; // whom to follow
    const loggedInUserId = req.user.id;

    if (targetUserId === loggedInUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Check if already following
    if (targetUser.followers.includes(loggedInUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    targetUser.followers.push(loggedInUserId);
    loggedInUser.following.push(targetUserId);

    await targetUser.save();
    await loggedInUser.save();

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const loggedInUserId = req.user.id;

    if (targetUserId === loggedInUserId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Remove from followers/following arrays
    targetUser.followers = targetUser.followers.filter(
      (f) => f.toString() !== loggedInUserId
    );
    loggedInUser.following = loggedInUser.following.filter(
      (f) => f.toString() !== targetUserId
    );

    await targetUser.save();
    await loggedInUser.save();

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
