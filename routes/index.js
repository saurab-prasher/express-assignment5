const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("index", { title: "Home page", data: "Home page" });
});

module.exports = router;
