import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Blacklist from "../models/Blacklist.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Check blacklist
      const blacklisted = await Blacklist.findOne({ token });
      if (blacklisted) {
        return res.status(401).json({
          success: false,
          message: "Token is blacklisted. Please log in again.",
        });
      }

      const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
      const decoded = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

// Optional authentication middleware: if a valid token is provided,
// populate `req.user`. If no token is present or it's invalid, do NOT
// return 401 — just continue without a user. This is useful for routes
// that can be accessed by guests (e.g. viewing an empty wishlist).
export const optional = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Check blacklist
      const blacklisted = await Blacklist.findOne({ token });
      if (blacklisted) {
        // treat as unauthenticated
        return next();
      }

      const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
      const decoded = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch (error) {
    // swallow error and continue as unauthenticated
  }

  return next();
};
