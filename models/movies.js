const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: String,
  plot: String,
  genres: [String],
  runtime: Number,
  rated: String,
  cast: [String],
  num_mflix_comments: Number,
  poster: String,
  lastupdated: Date,
  languages: [String],
  released: Date,
  directors: [String],
  writers: [String],
  awards: {
    wins: Number,
    nominations: Number,
    text: String,
  },
  imdb: {
    rating: Number,
    votes: Number,
    id: Number,
  },

  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
});
module.exports = mongoose.model("Movies", movieSchema);
