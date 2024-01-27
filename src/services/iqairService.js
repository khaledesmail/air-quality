const ApiAdapter = require("../api");
const AirQuality = require("../models/airQualityModel");
const config = require("../config");

class IQAirService {
  constructor(apiKey = config.iqairApiKey, apiUrl = config.apiUrls.iqair) {
    this.apiAdapter = new ApiAdapter(apiKey, apiUrl);
  }

  async getAirQuality(latitude, longitude) {
    const endpoint = "nearest_city";
    const params = { lat: latitude, lon: longitude };

    try {
      return await this.apiAdapter.get(endpoint, params);
    } catch (error) {
      throw error;
    }
  }
  async airQuality(longitude, latitude) {
    try {
      const response = await this.getAirQuality(latitude, longitude);
      const { pollution } = response.data.current;
      if (!pollution) {
        return {
          Result: {
            Pollution: {},
          },
        };
      }
      const { ts, aqius, mainus, aqicn, maincn } = pollution;
      const airQualityResponse = {
        Result: {
          Pollution: {
            ts,
            aqius,
            mainus,
            aqicn,
            maincn,
          },
        },
      };
      return airQualityResponse;
    } catch (error) {
      throw error;
    }
  }

  async fetchAirQualityDataForParis() {
    const parisLatitude = 48.856613;
    const parisLongitude = 2.352222;
    try {
      const response = await this.getAirQuality(parisLatitude, parisLongitude);
      const { pollution } = response.data.current;
      const airQualityData = {
        city: response.data.city,
        state: response.data.state,
        country: response.data.country,
        location: {
          type: "Point",
          coordinates: [parisLongitude, parisLatitude],
        },
        pollution: {
          ts: pollution.ts,
          aqius: pollution.aqius,
          mainus: pollution.mainus,
          aqicn: pollution.aqicn,
          maincn: pollution.maincn,
        },
      };

      return airQualityData;
    } catch (error) {
      console.error("Error fetching air quality data:", error.message);
      throw error;
    }
  }
  async createAirQualityForParis() {
    try {
      const airQualityData = await this.fetchAirQualityDataForParis();
      await AirQuality.create({
        city: airQualityData.city,
        state: airQualityData.state,
        country: airQualityData.country,
        location: {
          type: "Point",
          coordinates: [
            airQualityData.location.coordinates[0],
            airQualityData.location.coordinates[1],
          ],
        },
        pollution: {
          ts: airQualityData.pollution.ts,
          aqius: airQualityData.pollution.aqius,
          mainus: airQualityData.pollution.mainus,
          aqicn: airQualityData.pollution.aqicn,
          maincn: airQualityData.pollution.maincn,
        },
      });
      console.log("Air quality data saved to MongoDB");
      return { satus: true };
    } catch (error) {
      throw error;
    }
  }

  async getmostPollutedDatetime() {
    try {
      const mostPollutedDatetime = await AirQuality.findOne({})
        .sort({ "pollution.aqius": -1 })
        .select("pollution.ts")
        .lean();
      if (!mostPollutedDatetime) {
        return null;
      }
      return mostPollutedDatetime.pollution.ts;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = IQAirService;
