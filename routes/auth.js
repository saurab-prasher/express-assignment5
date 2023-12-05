// routes/auth.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Register a new user
router.post("/register", async (req, res) => {
  res.send("register here");
  // Implement user registration logic
});

// Login
router.post("/login", async (req, res) => {
  res.send("login here");
  // Implement user login logic
});

// Get authenticated user
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
