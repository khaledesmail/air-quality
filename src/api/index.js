const axios = require("axios");
const config = require("../config");

class ApiAdapter {
  constructor(apiKey, apiUrl) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || config.apiUrls.iqair; // Use config if not provided
  }

  async get(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.apiUrl}/${endpoint}`, {
        params: { ...params, key: this.apiKey },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
}

module.exports = ApiAdapter;
