const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const isPatient = require("../../middleware/isPatient");

const Patient = require("../../models/Patient");

//@route Get api/patient/profile
//@desc Get patient profile
//@access  privete
router.get("/profile", auth, isPatient, async (req, res) => {
  try {
    const patprofile = await Patient.findById(req.user.id).select([
      "name",
      "email",
      "address",
      "dob",
      "gender",
      "avatar",
    ]);
    if (!patprofile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(patprofile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/patient/update
//@desc update profile
//@access  private
router.post(
  "/update",
  [
    auth,
    isPatient,
    [
      check("name", "Name is required").not().isEmpty(),
      check("gender", "Gender is required").not().isEmpty(),
      check("address", "Address is required").not().isEmpty(),
      check("dob", "Date of birth is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, gender, address, dob } = req.body;

    try {
      let patient = await Patient.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            name,
            gender,
            address,
            dob,
          },
        },
        { new: true }
      );

      await patient.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
