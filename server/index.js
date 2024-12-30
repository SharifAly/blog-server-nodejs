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
  origin: "*", // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: "GET,POST,PUT,DELETE,OPTIONS",
};

app.use(cors(corsOptions)); // Enable CORS with specified options
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// OPTIONS-Preflight-Anfragen explizit behandeln
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://blog.sharif-aly.tech");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.sendStatus(200); // Preflight ist erfolgreich
});

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
      // console.log(results); // Log query results
    }
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
