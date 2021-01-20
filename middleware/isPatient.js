module.exports = (req, res, next) => {
  if (req.user.role === "patient") {
    next();
  } else {
    return res.status(401).json({ msg: "Only Patients can access this path." });
  }
};
