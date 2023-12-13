const Movie = require("../models/movies");

module.exports = async function () {
  try {
    const topRatedMovies = await Movie.find({
      "imdb.rating": { $exists: true, $ne: null, $gte: 9 },
    })
      .sort({ "imdb.rating": -1 })
      .limit(10);

    return topRatedMovies;
  } catch (error) {
    console.error("Error fetching top-rated movies:", error);
    return [];
  }
};
