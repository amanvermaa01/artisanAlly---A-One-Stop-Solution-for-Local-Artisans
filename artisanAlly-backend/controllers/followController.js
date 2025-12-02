import User from "../models/User.js";

// Follow a user
export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id; // User to follow
    const loggedInUserId = req.user._id;

    if (targetUserId === loggedInUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Check if already following (using string comparison)
    const isAlreadyFollowing = loggedInUser.following.some(id => id.toString() === targetUserId.toString());
    if (isAlreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following/followers lists using MongoDB operators to prevent duplicates
    await User.findByIdAndUpdate(loggedInUserId, {
      $addToSet: { following: targetUserId }
    });
    
    const updatedTargetUser = await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: loggedInUserId }
    }, { new: true });

    res.json({ 
      message: "Followed successfully",
      following: true,
      followersCount: updatedTargetUser.followers.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const loggedInUserId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Check if currently following (using string comparison)
    const isCurrentlyFollowing = loggedInUser.following.some(id => id.toString() === targetUserId.toString());
    if (!isCurrentlyFollowing) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    // Use MongoDB $pull operator to remove from arrays
    await User.findByIdAndUpdate(loggedInUserId, {
      $pull: { following: targetUserId }
    });
    
    const updatedTargetUser = await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId }
    }, { new: true });

    res.json({ 
      message: "Unfollowed successfully",
      following: false,
      followersCount: updatedTargetUser.followers.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get follow status
export const getFollowStatus = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const loggedInUserId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const isFollowing = loggedInUser.following.some(id => id.toString() === targetUserId.toString());
    const followersCount = targetUser.followers.length;
    const followingCount = targetUser.following.length;

    res.json({
      following: isFollowing,
      followersCount,
      followingCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
