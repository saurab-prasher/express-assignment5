const Movie = require("../models/movies");
module.exports = async function (id) {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie)
      return {
        mainMessage: "Movie Not  Found",
        secondaryMessage: "Something went wrong.",
      };

    return {
      mainMessage: "Movie Deleted Successfully",
      secondaryMessage: "The movie has been deleted from your collection.",
    };
  } catch (error) {
    console.error("Error occurred:", error);
  }
};
// o deleteMovieById(Id): Delete an existing Movie whose "\_id" value matches the "Id"
// parameter
