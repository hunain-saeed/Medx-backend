const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const Doctor = require("../../models/Doctor");
const Specialization = require("../../models/Specialization");
const isDoctor = require("../../middleware/isDoctor");

// TODO add is patient middleware to all patient routes

// @route  GET api/doctor
// @desc   Get all doctor profiles
// @access Public
// TODO see if return descriprion or not
router.get("/", async (req, res) => {
  try {
    const profiles = await Doctor.find()
      .select(["name", "avatar", "charges", "education", "description"])
      .populate("specializations", "-_id specialization");
    if (!profiles) {
      return res.status(400).send("No Doctor profile found");
    }
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route Get api/doctor/profile
//@desc Get Doctor profile
//@access  privete
router.get("/profile", auth, isDoctor, async (req, res) => {
  try {
    const docprofile = await Doctor.findById(req.user.id)
      .select([
        "name",
        "email",
        "phoneno",
        "dob",
        "gender",
        "days",
        "start_time",
        "duration",
        "patient_per_day",
        "avatar",
        "charges",
        "education",
        "description",
      ])
      .populate("specializations", "-_id specialization");
    if (!docprofile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(docprofile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/doctor/update
//@desc update doctor profile
//@access private
router.post(
  "/update",
  [
    auth,
    isDoctor,
    [
      check("name", "Name is required").not().isEmpty(),
      check("address", "Address is required").not().isEmpty(),
      check("phoneno", "Phone no is required").not().isEmpty(),
      check("education", "Education fields can not be empty").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      address,
      phoneno,
      charges,
      education,
      description,
    } = req.body;

    try {
      let doctor = await Doctor.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            name,
            address,
            phoneno,
            charges,
            education,
            description,
          },
        },
        { new: true }
      );
      await doctor.save();
      res.json(doctor);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route  GET api/doctor/search/:spec_id
// @desc   Get specifics doctors search by specialization profiles
// @access Public
// TODO add description in return list
router.get("/search/:spec_id", async (req, res) => {
  try {
    const profiles = await Specialization.findById(
      req.params.spec_id
    ).populate("doctors", [
      "name",
      "avatar",
      "charges",
      "education",
      "description",
    ]);

    if (!profiles) {
      return res.status(400).send("No Doctor profile found");
    }
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  GET api/doctor/:doc_id
// @desc   Get  docprofiles by user ID
// @access Public
router.get("/:doc_id", async (req, res) => {
  try {
    const profile = await Doctor.findById(req.params.doc_id)
      .select([
        "name",
        // "email",
        // "phoneno",
        // "gender",
        "avatar",
        "charges",
        // "education",
        // "description",
      ])
      .populate("specializations", "-_id specialization");
    if (!profile) {
      return res.status(400).send("No Doctor profile found");
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "There is no Doctor" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
