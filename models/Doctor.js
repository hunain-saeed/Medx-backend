const mongoose = require("mongoose");

// TODO - add comment field in schema
const DoctorSchema = new mongoose.Schema({
  specializations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "specialization",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneno: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  days: {
    type: [String],
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  patient_per_day: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  charges: {
    type: Number,
    required: true,
  },
  education: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
  },
  // TODO implement rating and review/commnet logic
  // see if need to create sperate table or not
  comment: {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
    },
    text: String,
  },
});

module.exports = mongoose.model("doctor", DoctorSchema);

// doctor schema
// days checkbox
// start time dropdown
// duration how many hours

// create 3 months shedule on registration

// id, day, start time, date, time

// orm: object relational mapping
//15