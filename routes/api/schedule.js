const express = require("express");
const router = express.Router();
const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment");

// @route   POST api/schedule/:doc_id
// @desc    Doctor 3 week shedule
// @access  Public
router.get("/:doc_id", async (req, res) => {
  function mintotime(time) {
    var m = time % 60;
    var h = (time - m) / 60;
    return h.toString() + ":" + (m < 10 ? "0" : "") + m.toString();
  }

  try {
    // search spec doctor and get its details to make his shedule
    const doctor = await Doctor.findById(req.params.doc_id, [
      "name",
      "avatar",
      "charges",
      "days",
      "start_time",
      "duration",
      "patient_per_day",
    ]);
    if (!doctor) {
      return res.status(400).json({ errors: [{ msg: "Doctor not found!" }] });
    }

    const appointment = await Appointment.find({ doctor: req.params.doc_id }, [
      "date_time",
      "time",
    ]);
    if (!appointment) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Appoinment not found!" }] });
    }
    // console.log(appointment[0].date_time);

    // patinet per day time in seconds
    let ppdts = (doctor.duration / doctor.patient_per_day) * 60 * 60;
    let sum = 0;
    let timing = [];
    const time = doctor.start_time.split(":");
    //change doctor start time to seconds so that unit is same
    const seconds =
      parseInt(time[0], 10) * 60 * 60 + parseInt(time[1], 10) * 60;

    //slice the time into shedule
    // so that time per patient can be created
    for (let i = 0; sum < doctor.duration * 60 * 60; i++) {
      timing[i] = mintotime((seconds + sum) / 60);
      sum = sum + ppdts;
    }
    let shedule = [];

    // Find what date is today so that we can draw shedule from today
    let today = new Date();
    let week = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    // Making schedule for 21 days
    // Making shedule for everyday
    for (let i = 0; i < 21; i++) {
      shedule.push({
        date: new Date(today.getTime() + 60 * 60 * 24 * 1000 * i),
        time: [...timing],
      });
    }
    // console.log(shedule);

    // Check if there is an appointment book on that day and time then pull null
    // on that time
    let ind;
    appointment.forEach((app) => {
      shedule.forEach((she) => {
        if (
          she.date.setUTCHours(0, 0, 0, 0) ===
          app.date_time.setUTCHours(0, 0, 0, 0)
        ) {
          ind = she.time.indexOf(app.time);
          she.time[ind] = null;
        }
      });
    });

    function isIn(vday) {
      for (var i = 0; i < 3; i++) {
        if (vday === doctor.days[i]) {
          return true;
        }
      }
      return false;
    }

    // Delete time for day on which doctor is not avaliable
    shedule.forEach((s) => {
      // ak din pechy chal raha hy isi ley -1 kia
      if (!isIn(week[s.date.getDay()-1])) {
        s.time = [];
      }
    });

    // console.log(shedule);

    res.json(shedule);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
