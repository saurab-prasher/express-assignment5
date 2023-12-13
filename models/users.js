const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true, required: true },

  role: {
    type: String,
    enum: ["admin", "user"], // Define possible roles
    default: "user", // Default role for new users
  },
});
// Method to set and hash the user's password
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
