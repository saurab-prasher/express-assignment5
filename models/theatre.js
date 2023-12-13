const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
  theaterId: Number,
  location: {
    address: {
      street1: String,
      city: String,
      state: String,
      zipcode: String,
    },
    geo: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
  },
});

// Create a 2dsphere index for geospatial queries
theaterSchema.index({ "location.geo": "2dsphere" });

const Theater = mongoose.model("Theater", theaterSchema);

module.exports = Theater;
