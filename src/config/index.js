require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  iqairApiKey: process.env.IQAIR_API_KEY || "test123",
  apiUrls: {
    iqair: process.env.IQAIR_API_URL || "http://localhost:4000/v2",
  },
  db: {
    url: process.env.MONGODB_URL || "mongodb://localhost:27017/airQuality"
  },
};

module.exports = config;
