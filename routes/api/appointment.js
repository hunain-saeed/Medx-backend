const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const isPatient = require("../../middleware/isPatient");
const isDoctor = require("../../middleware/isDoctor");
const Appointment = require("../../models/Appointment");
const Doctor = require("../../models/Doctor");

// @route   Get api/appointment/patient/view
// @desc    view appointment
// @access  Private
router.get("/patient/view", auth, isPatient, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id });
    if (!appointments) {
      return res.json(appointments);
      // return res.status(400).json({ errors: [{ msg: "Appointments not found" }] });
    }
    appointments.reverse();
    return res.json(appointments);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   Get api/appointment/doctor/view
// @desc    view appointment
// @access  Private
router.get("/doctor/view", auth, isDoctor, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id });
    if (!appointments) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Appointments not found." }] });
    }
    appointments.reverse();
    return res.json(appointments);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/appointment/:doc_id
// @desc    Book an appointment
// @access  Private
router.post(
  "/:doc_id",
  [
    auth,
    isPatient,
    [
      check("date_time", "Invalid date").not().isEmpty(),
      check("time", "Invalid time").not().isEmpty(),
      check("age", "Age is Invalid").not().isEmpty(),
      check("patientname", "Invalid patient name").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //if there is a error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //accesing doctor
      const doctor = await Doctor.findById(req.params.doc_id, [
        "name",
        "charges",
      ]);
      if (!doctor) {
        return res.status(400).json({ errors: [{ msg: "Doctor not found" }] });
      }
      // create new appointment
      const newAppointment = new Appointment({
        patient: req.user.id,
        doctor: req.params.doc_id,
        date_time: req.body.date_time,
        time: req.body.time,
        // token: req.body.token,
        total_bill: doctor.charges,
        age: req.body.age,
        patientname: req.body.patientname,
        doctorname: doctor.name,
      });

      // save appointmnet in db
      const appointment = await newAppointment.save();

      try {
        const appointments = await Appointment.find({ patient: req.user.id });
        if (!appointments) {
          return res.json(appointments);
          // return res.status(400).json({ errors: [{ msg: "Appointments not found" }] });
        }
        appointments.reverse();
        return res.json(appointments);
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
