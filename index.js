const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Connect DB
connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("API Running");
});

// Define Routes
app.use("/api/login", require("./routes/api/login"));
app.use("/api/register", require("./routes/api/register"));
app.use("/api/specialization", require("./routes/api/specialization"));
app.use("/api/doctor", require("./routes/api/doctor"));
app.use("/api/appointment", require("./routes/api/appointment"));
app.use("/api/patient", require("./routes/api/patient"));
app.use("/api/schedule", require("./routes/api/schedule"));

// const PORT = 4000;

// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });

app.listen(process.env.PORT || 4000, process.env.IP, function () {
  console.log('Server started on port');
});
