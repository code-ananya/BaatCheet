import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? true // Allow same-origin in production since frontend is served by backend
        : "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Connect to DB
connectDB().catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../../frontend/chat-app/dist")));

    app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/chat-app", "dist", "index.html"));
  });
}

// Start server (for Render deployment)
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export for compatibility
export default app;