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

// Validate required environment variables
if (!process.env.MONGO_URI) {
    console.error("ERROR: MONGO_URI is not defined in .env file");
    process.exit(1);
}
if (!process.env.JWT_SECRET_KEY) {
    console.error("ERROR: JWT_SECRET_KEY is not defined in .env file");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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

// Connect to DB and start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    });

export { app }