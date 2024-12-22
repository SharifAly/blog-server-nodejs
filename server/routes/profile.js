import express from "express";
import db from "../middleware/db.js";

const router = express.Router();

// Route to get all user IDs
router.get("/profile/id", (req, res) => {
  const sql = "SELECT id FROM blog.users"; // SQL query to select all user IDs
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err); // Log error if query fails
    } else {
      res.send(result); // Send query result as response
    }
  });
});

// Route to get user profile by ID
router.get("/profile/:id", (req, res) => {
  const params = req.params.id; // Get user ID from request parameters
  const sql = "SELECT * FROM blog.users WHERE id = ?"; // SQL query to select user by ID
  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err); // Log error if query fails
    } else {
      res.send(result); // Send query result as response
    }
  });
});

// Route to delete user by ID
router.delete("/delete/:id", (req, res) => {
  const params = req.params.id; // Get user ID from request parameters
  const sql = "DELETE FROM blog.users WHERE id = ?"; // SQL query to delete user by ID
  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err); // Log error if query fails
      res.status(500).send("Error deleting user"); // Send error response
    } else {
      res.send("User deleted successfully"); // Send success response
    }
  });
});

export default router; // Export the router