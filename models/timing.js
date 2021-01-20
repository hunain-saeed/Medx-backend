const mongoose = require("mongoose");
// TODO not usefull 
const TimmingSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
  },
  time: [[arry],[],[]],
  
  date: [
    {
      date:{
        type: Date,
      },
      day: {
        type: String,
      },
      time: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("timming", TimmingSchema);
