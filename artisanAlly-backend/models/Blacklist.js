import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }, // same as JWT expiry
});

export default mongoose.model("Blacklist", blacklistSchema);
