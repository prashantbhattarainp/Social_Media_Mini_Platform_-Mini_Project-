import connectDB from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";

connectDB();
app.use("/api/posts", postRoutes);