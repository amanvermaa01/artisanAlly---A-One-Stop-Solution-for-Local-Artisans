import User from "../models/User.js";

// Update profile with file uploads and category
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { bio, category } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // If files are uploaded
    if (req.files?.profilePicture) {
      user.profilePicture = req.files.profilePicture[0].path;
    }

    if (user.role === "artisan") {
      if (req.files?.backgroundPhoto) {
        user.backgroundPhoto = req.files.backgroundPhoto[0].path;
      }
      if (bio) user.bio = bio;
      if (category) user.category = category; // artisan can set category
    } else if (user.role === "customer") {
      if (req.files?.backgroundPhoto) {
        return res
          .status(403)
          .json({ success: false, message: "Customers cannot set background photo" });
      }
      if (bio) user.bio = bio;
      if (category) user.category = category; // customers can also set category
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all artisans
export const getArtisans = async (req, res) => {
  try {
    const artisans = await User.find({ role: "artisan" }).select("-password");
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (only artisans can access)
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "artisan") {
      return res
        .status(403)
        .json({ message: "Only artisans can see all users" });
    }
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔍 Search users by category, name, or location
export const searchUsers = async (req, res) => {
  try {
    const { query, category } = req.query;
    let filter = {};

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
      ];
    }

    // Customers can only see artisans
    if (req.user.role === "customer") {
      filter.role = "artisan";
    }

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
