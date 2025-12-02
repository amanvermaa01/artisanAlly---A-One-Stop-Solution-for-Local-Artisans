import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import blackList from "../models/Blacklist.js";
import { sendEmail } from "../utils/sendEmail.js";

// Register
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, gender, location, mobile, role } = req.body;
    email = (email || "").toLowerCase().trim();

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      !gender?.trim() ||
      !location?.trim() ||
      !mobile?.trim() ||
      !role?.trim()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    // Case-insensitive existence check
    const userExists = await User.findOne({
      email: {
        $regex: `^${email.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });
    if (userExists)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    // Create user - password will be automatically hashed by the pre-save hook
    const user = await User.create({
      name,
      email,
      password,
      gender,
      location,
      mobile,
      role,
    });

    const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
      expiresIn: "7d",
    });

    // ✅ Send Welcome Email (don't fail registration if email fails)
    try {
      const subject = "🎉 Welcome to ArtisanAlly!";
      const message = `
        <h2>Hello ${name},</h2>
        <p>Welcome to <b>ArtisanAlly</b>! We're excited to have you as a ${role}.</p>
        <p>Start exploring and connecting with our community.</p>
        <br/>
        <p>Cheers, <br/> ArtisanAlly Team</p>
      `;
      await sendEmail(email, subject, message);
    } catch (emailError) {
      console.log("Failed to send welcome email:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        location: user.location,
        mobile: user.mobile,
        role: user.role,
        bio: user.bio,
        category: user.category,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = (email || "").toLowerCase().trim();
    if (!email?.trim() || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    // Case-insensitive login lookup
    const user = await User.findOne({
      email: {
        $regex: `^${email.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        location: user.location,
        mobile: user.mobile,
        role: user.role,
        bio: user.bio,
        category: user.category,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });

    // Decode token to get expiry
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    // Save token to blacklist with expiry
    const expiresAt = new Date(decoded.exp * 1000);
    await blackList.create({ token, expiresAt });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ OAuth success callback
export const oauthSuccess = async (req, res) => {
  try {
    const user = req.user; // Passport sets this
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "OAuth login failed" });

    // Issue JWT for consistency with frontend
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "OAuth login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        location: user.location,
        mobile: user.mobile,
        role: user.role,
        bio: user.bio,
        category: user.category,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reset password (dev utility) - protected by header key
export const resetPassword = async (req, res) => {
  try {
    const providedKey =
      req.headers["x-reset-key"] || req.headers["X-Reset-Key"];
    const expectedKey = process.env.RESET_PASSWORD_KEY || "dev_reset_key";
    if (!providedKey || providedKey !== expectedKey) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let { email, newPassword } = req.body;
    email = (email || "").toLowerCase().trim();
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email and newPassword are required",
        });
    }

    const user = await User.findOne({
      email: {
        $regex: `^${email.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
