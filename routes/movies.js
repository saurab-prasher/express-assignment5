const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Movies = require("../models/movies");
const { body, validationResult } = require("express-validator");
const validate = [body("title").notEmpty().withMessage("Title is required")];

router.get("/addmovie", async (req, res) => {
  try {
    res.render("addMovie");
  } catch (error) {
    console.error("Error ", error);
  }
});

router.post("/", validate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const newMovieData = req.body;

    const newMovie = new Movies(newMovieData);

    const savedMovie = await newMovie.save();

    res.status(201).json({ message: "Movie created successfully" });
    console.log(savedMovie);
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
    const movies = await Movies.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    console.log(movies[0]);

    const totalMovies = await Movies.countDocuments();
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
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get details of a specific movie by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const movie = await Movies.findOne({ _id: id }).exec();
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    //  console.log(movie.title);
    console.log(movie.imdb);
    res.render("movie", { movieData: movie });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedMovie = await Movies.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a specific movie by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movies.findByIdAndDelete(req.params.id);
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
