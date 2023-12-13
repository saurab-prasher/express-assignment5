const Movie = require("../models/movies");
module.exports = async function (data) {
  try {
    const newMovieData = data;
    const newMovie = new Movie(newMovieData);

    const savedMovie = await newMovie.save();

    return {
      mainMessage: "Movie added  successfully",
      secondaryMessage: "The movie has been added in your collection.",
    };
  } catch (error) {
    return {
      mainMessage: "Failed to add a new movie. Please try again later.",
      secondaryMessage: "Something went wrong.",
    };
  }
};
// o db.addNewMovie(data): Create a new Movie in the collection using the object passed in
// the "data" parameter
