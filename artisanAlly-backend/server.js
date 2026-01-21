import "dotenv/config";
console.log("DEBUG: AI_API_KEY from process.env:", process.env.AI_API_KEY ? "EXISTS" : "MISSING");
console.log("DEBUG: AI_PROVIDER from process.env:", process.env.AI_PROVIDER);
import express from "express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import passport from "./config/passport.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import dashboardRoutes from "./routes/dashboardRoute.js";
import followRoute from "./routes/followRoute.js";
import profileRoute from "./routes/profileRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import aiRoute from "./routes/aiRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    process.env.FRONTEND_URL, // e.g. https://your-app.vercel.app
    /^https:\/\/artisan-ally.*\.vercel\.app$/ // Matches any Vercel deployment of this app
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan("dev"));
// Session middleware (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ArtisanAlly API" });
});
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", followRoute);
app.use("/api/profile", profileRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", paymentRoute);
app.use("/api/ai", aiRoute);
app.use("/api/wishlist", wishlistRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// REQUIRED: Export the app for Vercel
export default app;
