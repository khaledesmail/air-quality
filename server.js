const express = require("express");
const airQualityRoute = require("./src/routes/airQualityRoute");
const config = require("./src/config");
const cron = require("node-cron");
const connectDB = require("./src/database/db");
const IQAirService = require("./src/services/iqairService");

const app = express();

app.use("/rest/api/v1/iqair", airQualityRoute);

connectDB();

cron.schedule("* * * * *", async () => {
  const iqairService = new IQAirService(
    process.env.IQAIR_API_KEY,
    config.apiUrls.iqair
  );
  console.log(`Air quality data triggered: ${new Date()}`);
  try {
    await iqairService.createAirQualityForParis();
  } catch (error) {
    console.error(error);
  }
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

module.exports = app;
