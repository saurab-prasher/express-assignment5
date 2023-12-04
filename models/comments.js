const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  movie_id: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  text: String,
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
