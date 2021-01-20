const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const Patient = require("../../models/Patient");
const Doctor = require("../../models/Doctor");
const Specialization = require("../../models/Specialization");
const { findOneAndUpdate } = require("../../models/Doctor");

// @route  POST api/register/patient
// @desc   Register patient
// @access Public
router.post(
  "/patient",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("gender", "Gender is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // If there is error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, address, dob, gender, password } = req.body;

    try {
      // See if patient exists
      let user = await Patient.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      }

      // Get user gravatar from email
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // Adding user to DataBase and returning user(with id) to 'user' object
      user = new Patient({
        name,
        email,
        address,
        dob,
        gender,
        avatar,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // Saving user to DataBase
      await user.save();

      // Return jsonwebtoken
      const payload = {
        // Created payload obj so we can send throw jwt
        user: {
          id: user.id,
          role: "patient",
        },
      };

      // Generating token
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 }, // TODO: change it to 3600
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // return token to client
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// TODO take doc shedule when sitting
// @route  POST api/register/doctor
// @desc   Register doctor
// @access Public
router.post(
  "/doctor",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("address", "Address is required").not().isEmpty(),
    // TODO - check pakistani number
    check("phoneno", "Phone no is required").not().isEmpty(),
    // TODO - check for date validation
    check("dob", "Date Of Birth is required").not().isEmpty(),
    check("gender", "Gender is required").not().isEmpty(),
    check("days", "Days are required").not().isEmpty(),
    check("start_time", "Start time is required").not().isEmpty(),
    check("duration", "Duration is required").not().isEmpty(),
    check("patient_per_day", "Patient Per day must be entered").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("charges", "Charges are required").not().isEmpty(),
    // TODO - check for array
    check("education", "Education fields can not be empty").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      email,
      address,
      phoneno,
      dob,
      gender,
      days,
      start_time,
      duration,
      patient_per_day,
      password,
      charges,
      education,
      description,
    } = req.body;
    const specializations = req.body.specializations;
    try {
      //See if Doctor exists
      let user = await Doctor.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });
      }

      //Get user gravatar from email
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // Adding user to DataBase and returning user(with id) to 'user' object
      user = new Doctor({
        specializations,
        name,
        email,
        address,
        phoneno,
        dob,
        gender,
        days,
        start_time,
        duration,
        patient_per_day,
        avatar,
        password,
        charges,
        education,
        description,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // Saving user to DataBase
      await user.save();

      // Return jsonwebtoken
      const payload = {
        // Created payload obj so we can send throw jwt
        user: {
          id: user.id,
          role: "doctor",
        },
      };
      
      // Adding doctor to specialization list
      specializations.forEach(async (element) => {
        try {
          let special = await Specialization.findById(element);
          //if specialization is not already present
          const temp = special.specialization;
          if (!special) {
            console.log({ msg: "Specialization not found" });
          }
          //if presnet
          else {
            special.doctors.push(user.id);
            await special.save();
          }
        } catch (error) {
          console.error(error.message);
          res.status(500).send("Server error SD");
        }
      });

      // Generating token
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 }, // TODO: change it to 3600
        (err, token) => {
          if (err) throw err;
          res.json({ token }); // return token to client
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
