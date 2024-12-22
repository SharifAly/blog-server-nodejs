import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import db from "./middleware/db.js";
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blog.js";
import profileRoutes from "./routes/profile.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // Set the port from environment variable or default to 5000

const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions)); // Enable CORS with specified options
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Use the imported route modules
app.use("/auth", authRoutes);
app.use("/blog", blogRoutes);
app.use("/profile", profileRoutes);

// Root route to test database connection
app.get("/", (req, res) => {
  db.query("SELECT * FROM blog.users", (err, results) => {
    if (err) {
      console.log(err); // Log error if query fails
    } else {
      res.send(results); // Send query results as response
      console.log(results); // Log query results
    }
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});