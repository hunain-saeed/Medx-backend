const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },
  patientname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  date_time: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    // required: true,
  },
  // TODO check if docname is needed or not
  doctorname: {
    type: String,
    required: true,
  },
  total_bill: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("appointment", AppointmentSchema);
