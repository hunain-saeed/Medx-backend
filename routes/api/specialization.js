const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const isDoctor = require("../../middleware/isDoctor");
const Specialization = require("../../models/Specialization");
const Doctor = require("../../models/Doctor");

// @route   GET api/specialization
// @desc    Get all specialization from db and show it in search bar or homepage
// @access  Public
router.get("/", async (req, res) => {
  try {
    // const specialization = await Specialization.find();
    const specialization = await Specialization.find().select("specialization");
    res.json(specialization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add specialization into spacialization db
// @route post temp
router.post("/all/insert", (req, res) => {
  const array = req.body.specialization;
  let specs;
  array.forEach(async (element) => {
    try {
      specs = new Specialization({
        specialization: element,
      });
      await specs.save();
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  });

  res.json(specs);
});

module.exports = router;





// @route   POST api/specialization/:doc_id
// @desc    Store current (newly registerd) doctor specialization
// @access  Private
// router.post(
//   "/:doc_id",
//   [
//     auth,
//     [check("specialization", "Specialization is required").not().isEmpty()],
//   ],
//   isDoctor,
//   async (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const docFields = {};
//     // Finding doctor by id and storing doctor name in doctorname variable
//     try {
//       const docname = await Doctor.findById(req.params.doc_id, "name");
//       docFields.name = docname.name;
//     } catch (error) {
//       console.error(error.message);
//       return res.status(500).send("Server Error");
//     }

//     // specialization ["", ""]
//     const { specialization } = req.body;
//     docFields.doctor = req.params.doc_id;

//     // TODO- chage it to automatically insert (now we are useing comma seperated value)
//     if (specialization) {
//       docFields.specialization = specialization
//         .split(",")
//         .map((item) => item.trim());
//     }

//     try {
//       // finding if doctor exist if yeas then updating
//       let spec = await Specialization.findOne({ doctor: req.params.doc_id });
//       if (spec) {
//         // Update spec
//         spec.specialization.push(specialization);
//         spec.name = docFields.name;
//         await spec.save();

//         return res.json(spec);
//       }

//       // Create new spec
//       spec = new Specialization(docFields);
//       await spec.save();

//       res.json(spec);
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );
