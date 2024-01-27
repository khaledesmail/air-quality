const mongoose = require("mongoose");

const airQualitySchema = new mongoose.Schema({
  city: String,
  state: String,
  country: String,
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [Number],
  },
  pollution: {
    ts: String,
    aqius: Number,
    mainus: String,
    aqicn: Number,
    maincn: String,
  },
});
const AirQuality = mongoose.model("AirQuality", airQualitySchema);

module.exports = AirQuality;
