const mongoose = require("mongoose");
// TODO bonus work
const RatingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },
  ratting: {
    type: Number,
  },
  review: {
    type: String,
  },
  date: {
    type: date,
    default: Date.now,
  },
});

module.exports = mongoose.model("rating", RatingSchema);
