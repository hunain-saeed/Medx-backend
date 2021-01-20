const mongoose = require("mongoose");

const SpecializationSchema = new mongoose.Schema({
  specialization: {
    type: String,
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
  ],
});

module.exports = mongoose.model("specialization", SpecializationSchema);

// doctor: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "doctor",
// },
// specialization: {
//   type: [String],
//   required: true,
// },
// name: {
//   type: String,
// },
