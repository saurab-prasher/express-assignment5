const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jwt: String,
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
