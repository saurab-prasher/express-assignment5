const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  _id: {
    $oid: String,
  },
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
});
module.exports = mongoose.model("Movies", movieSchema);
