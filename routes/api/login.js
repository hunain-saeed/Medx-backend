const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");

const Patient = require("../../models/Patient");
const Doctor = require("../../models/Doctor");
const auth = require("../../middleware/auth");

// @route   GET api/login
// @desc    Tes route
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/login/patient
// @desc    Authenticate patient & get token (login)
// @access  Public
router.post(
  "/patient",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // If there is error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      // See if user exists or not
      let user = await Patient.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Check for password is correct for user or not
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

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
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/login/doctor
// @desc    Authenticate patient & get token (login)
// @access  Public
router.post(
  "/doctor",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // If there is error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      // See if user exists or not
      let user = await Doctor.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Check for password is correct for user or not
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Return jsonwebtoken
      const payload = {
        // Created payload obj so we can send throw jwt
        user: {
          id: user.id,
          role: "doctor",
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
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
