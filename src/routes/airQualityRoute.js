const express = require("express");
const IQAirService = require("../services/iqairService");
const router = express.Router();

router.get("/get_air_quality", async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    if (!longitude || !latitude) {
      return res
        .status(400)
        .json({ error: "Longitude and latitude are required parameters." });
    }

    const iqairService = new IQAirService();
    const weatherData = await iqairService.airQuality(
      longitude.toString(),
      latitude.toString()
    );
    return res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/most_polluted_datetime', async (req, res) => {
  try {
    const iqairService = new IQAirService();
    const mostPollutedDatetime = await iqairService.getmostPollutedDatetime()
    if (!mostPollutedDatetime) {
      return res.status(404).json({ error: 'No air quality data found' });
    }
    res.status(200).json({ mostPollutedDatetime: mostPollutedDatetime });
  } catch (error) {
    console.error('Error fetching most polluted datetime:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
