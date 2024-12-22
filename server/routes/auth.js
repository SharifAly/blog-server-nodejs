import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../middleware/db.js";

const router = express.Router();

//TODO - Add a route to register a new user



// Route to handle user login
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email; // Get email from request body
    const password = req.body.password; // Get password from request body

    const sql = `SELECT * FROM blog.users WHERE email =?`; // SQL query to find user by email

    // Execute SQL query
    const result = await new Promise((resolve, reject) => {
      db.query(sql, [email], (err, result) => {
        if (err) {
          reject(err); // Reject promise if error occurs
        } else {
          resolve(result); // Resolve promise with query result
        }
      });
    });

    if (result.length === 0) {
      return res.status(400).send({
        message: "Username or password incorrect!", // Send error if user not found
      });
    }

    // Compare provided password with stored hashed password
    const bResult = await new Promise((resolve, reject) => {
      bcrypt.compare(password, result[0]["password"], (bErr, bResult) => {
        if (bErr) {
          reject(bErr); // Reject promise if error occurs
        } else {
          resolve(bResult); // Resolve promise with comparison result
        }
      });
    });

    if (bResult) {
      // Generate JWT token if password matches
      const token = jwt.sign(
        {
          userEmail: result[0].email,
          userId: result[0].id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "10h" }
      );

      // Set token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 10 * 60 * 60 * 1000, // 10 hours
      });

      return res.status(200).send({
        message: "Logged in!",
        userId: result[0].id, // Ensure userId is sent in the response
      });
    }

    return res.status(400).send({
      message: "Username or password incorrect!", // Send error if password does not match
    });
  } catch (error) {
    return res.status(400).send({
      message: "An error occurred!", // Send error if any exception occurs
      error,
    });
  }
});


router.post("/register", (req, res) => {
  try {
    // Get the data from the request body
    const { f_name, l_name, email, password } = req.body;

    // Validate input
    if (!f_name || !l_name || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    // Hash the incoming password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // SQL query to check if email already exists
    const checkEmailExist = "SELECT * FROM blog.users WHERE email = ?";
    db.query(checkEmailExist, [email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      if (result.length > 0) {
        // Email already exists
        return res.status(400).send("Email already exists");
      }

      // Email does not exist, insert new user to database
      const registerNewUserQuery =
        "INSERT INTO blog.users (first_name, last_name, email, password) VALUES (?,?,?,?)";
      db.query(
        registerNewUserQuery,
        [f_name, l_name, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
          }
          res.send("User registered successfully");
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;