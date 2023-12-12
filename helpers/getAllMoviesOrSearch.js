const Movie = require("../models/movies");

module.exports = async function getAllMoviesOrSearch(title, page, perPage) {
  try {
    let query = {
      poster: { $exists: true, $ne: null, $ne: "" }, // Filter movies with images
    };

    // If title is provided, add it to the query
    if (title) {
      query.title = { $regex: new RegExp(title, "i") };
    }
    const allMovies = await Movie.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalMovies = await Movie.countDocuments(query);
    const totalPages = Math.ceil(totalMovies / perPage);

    return {
      allMovies,
      totalMovies,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
    };
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

// db.getAllMovies(page, perPage, title): Return an array of all Movies for a specific page
// (sorted by Movie_id), given the number of items per page. For example, if page is 2 and
// perPage is 5, then this function would return a sorted list of Movies (by Movie_id),
// containing items 6 – 10. This will help us to deal with the large amount of data in this
// dataset and make paging easier to implement in the UI later. Additionally, there is an
// optional parameter "title" that can be used to filter results by a specific "title" value
