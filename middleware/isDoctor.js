module.exports = (req, res, next) => {
  if (req.user.role === "doctor") {
    next();
  } else {
    return res.status(401).json({ msg: "Only Doctors can access this path." });
  }
};
