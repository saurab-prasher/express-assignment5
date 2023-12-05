const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Movies = require("../models/movies");

/* GET home page. */
router.post("/", async (req, res) => {
  try {
    const newMovieData = req.body;

    const newMovie = new Movies(newMovieData);

    const savedMovie = await newMovie.save();

    res.status(201).json(savedMovie);
  } catch (error) {
    console.error("Failed to add a new movie:", error);
    res.status(500).json({ error: "Failed to add a new movie." });
  }
});

// Get a list of all movies
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10; // Adjust this based on your preference

  try {
    const movies = await Movie.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    console.log(movies[0]);

    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / perPage);

    res.render("movies", {
      movies,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get details of a specific movie by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const movie = await Movie.find({ _id: id }).exec();
    console.log(movie[0].title);
    res.render("movie", { movieData: movie[0] });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update details of a specific movie by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMovie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a specific movie by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }
    res.json(deletedMovie);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
