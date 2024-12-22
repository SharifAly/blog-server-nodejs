import express from "express";
import jwt from "jsonwebtoken";
import db from "../middleware/db.js";

const router = express.Router();

// Route to get all blog posts
router.get("/blog", (req, res) => {
  const sql = "SELECT * FROM blog.posts ORDER BY created_at DESC"; // SQL query to select all posts ordered by creation date
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err); // Log error if query fails
    } else {
      res.send(result); // Send query result as response
    }
  });
});

// Route to get the latest 4 blog posts
router.get("/latest", (req, res) => {
  const sql = "SELECT * FROM blog.posts ORDER BY created_at DESC LIMIT 4"; // SQL query to select the latest 4 posts
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err); // Log error if query fails
    } else {
      res.send(result); // Send query result as response
    }
  });
});

// Route to create a new blog post
router.post("/post", (req, res) => {
  const { title, category, image, body } = req.body; // Get post details from request body
  const sql =
    "INSERT INTO blog.posts (title, category, image, body, fk_user_id) VALUES (?,?,?,?,?)"; // SQL query to insert a new post
  const token = req.cookies.token; // Get JWT token from cookies
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify and decode the token
  const userId = decode.userId; // Get user ID from decoded token
  db.query(sql, [title, category, image, body, userId], (err, result) => {
    if (err) {
      res.status(500).send(err.message); // Send error if query fails
    } else {
      res.send(result); // Send query result as response
    }
  });
});

// Route to get blog post details by ID
router.get("/details/:id", (req, res) => {
  const params = req.params.id; // Get post ID from request parameters
  const sql = "SELECT * FROM blog.posts WHERE id = ?"; // SQL query to select post by ID
  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err); // Log error if query fails
    } else {
      res.send(result); // Send query result as response
    }
  });
});

export default router; // Export the router