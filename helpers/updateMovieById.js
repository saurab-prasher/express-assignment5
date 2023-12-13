const Movie = require("../models/movies");

module.exports = async function (data, id) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, data, { new: true });

    if (!updatedMovie) {
      return {
        mainMessage: "Movie Not  Found",
        secondaryMessage: "Something went wrong.",
      };
    }

    return {
      mainMessage: "Movie Updated Successfully",
      secondaryMessage: "The movie has been updated in your collection.",
    };
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// o updateMovieById(data,Id): Overwrite an existing Movie whose "\_id" value matches the
// "Id" parameter, using the object passed in the "data" parameter.
