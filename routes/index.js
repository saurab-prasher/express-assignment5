const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Movies = require("../models/movies");
/* GET home page. */
router.get("/", async (req, res, next) => {
  const allMovies = await Movies.find({});
  console.log(allMovies.length);
  res.render("index", { title: "Express", data: allMovies.length });
});

module.exports = router;
