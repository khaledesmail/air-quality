const assert = require("assert");
const nock = require("nock");
const sinon = require("sinon");
const IQAirService = require("../src/services/iqairService.js");
const AirQuality = require("../src/models/airQualityModel.js");

const longitude = "131.1870162";
const latitude = "33.6060463";
const apiKey = "YOUR_IQAIR_API_KEY";

describe("Air Quality Functions", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it("should return air quality data for a valid location", async () => {
    const expectedResponse = {
      data: {
        current: {
          pollution: {
            ts: "2024-01-24T22:00:00.000Z",
            aqius: 45,
            mainus: "p2",
            aqicn: 29,
            maincn: "p1",
          },
        },
      },
    };
    nock("https://api.airvisual.com")
      .get("/v2/nearest_city")
      .query({ lat: latitude, lon: longitude, key: apiKey })
      .reply(200, expectedResponse);

    const iqairService = new IQAirService(apiKey);
    const airQualityData = await iqairService.airQuality(longitude, latitude);

    try {
      assert.strictEqual(
        airQualityData.Result.Pollution.ts,
        expectedResponse.data.current.pollution.ts
      );
      assert.strictEqual(
        airQualityData.Result.Pollution.aqius,
        expectedResponse.data.current.pollution.aqius
      );
      assert.strictEqual(
        airQualityData.Result.Pollution.mainus,
        expectedResponse.data.current.pollution.mainus
      );
      assert.strictEqual(
        airQualityData.Result.Pollution.aqicn,
        expectedResponse.data.current.pollution.aqicn
      );
      assert.strictEqual(
        airQualityData.Result.Pollution.maincn,
        expectedResponse.data.current.pollution.maincn
      );
    } catch (error) {
      throw new AssertionError(error);
    }
  });

  it("should return an error message when air quality data for invalid location", async () => {
    const invalidLongitude = "invalid_longitude";
    const invalidLatitude = "invalid_latitude";

    nock("https://api.airvisual.com")
      .get("/v2/nearest_city")
      .query({ lat: invalidLatitude, lon: invalidLongitude, key: apiKey })
      .reply(400, {
        message: "Invalid location provided",
      });
    try {
      const iqairService = new IQAirService(apiKey);
      await iqairService.airQuality(invalidLongitude, invalidLatitude);
    } catch (error) {
      assert.strictEqual(error.message, "Invalid location provided");
    }
  });

  it("should fetch air quality data for Paris", async () => {
    const parisLatitude = 48.856613;
    const parisLongitude = 2.352222;

    const mockedResponse = {
      data: {
        city: "Paris",
        state: "Ile-de-France",
        country: "France",
        current: {
          pollution: {
            ts: "2024-01-24T22:00:00.000Z",
            aqius: 45,
            mainus: "p2",
            aqicn: 29,
            maincn: "p1",
          },
        },
      },
    };

    nock("https://api.airvisual.com")
      .get("/v2/nearest_city")
      .query({ lat: parisLatitude, lon: parisLongitude, key: apiKey })
      .reply(200, mockedResponse);
    const iqairService = new IQAirService(apiKey);
    const result = await iqairService.fetchAirQualityDataForParis();
    assert.deepStrictEqual(result, {
      city: "Paris",
      state: "Ile-de-France",
      country: "France",
      location: {
        type: "Point",
        coordinates: [parisLongitude, parisLatitude],
      },
      pollution: {
        ts: "2024-01-24T22:00:00.000Z",
        aqius: 45,
        mainus: "p2",
        aqicn: 29,
        maincn: "p1",
      },
    });
  });

  it("should create air quality data for Paris", async () => {
    const mockedAirQualityData = {
      city: "Paris",
      state: "Ile-de-France",
      country: "France",
      location: {
        type: "Point",
        coordinates: [2.352222, 48.856613],
      },
      current: {
        pollution: {
          ts: "2024-01-24T22:00:00.000Z",
          aqius: 45,
          mainus: "p2",
          aqicn: 29,
          maincn: "p1",
        },
      },
    };

    const mockedAirQualityResponse = {
      city: "Paris",
      state: "Ile-de-France",
      country: "France",
      location: {
        type: "Point",
        coordinates: [2.352222, 48.856613],
      },
      pollution: {
        ts: "2024-01-24T22:00:00.000Z",
        aqius: 45,
        mainus: "p2",
        aqicn: 29,
        maincn: "p1",
      },
    };

    nock("https://api.airvisual.com")
      .get("/v2/nearest_city")
      .query({ lat: 48.856613, lon: 2.352222, key: apiKey })
      .reply(200, {
        data: mockedAirQualityData,
      });
    const iqairService = new IQAirService(apiKey);
    const createStub = sinon.stub(AirQuality, "create").resolves();
    const result = await iqairService.createAirQualityForParis();

    assert.deepStrictEqual(result, { satus: true });
    sinon.assert.calledOnce(createStub);
    sinon.assert.calledWithExactly(
      createStub,
      sinon.match(mockedAirQualityResponse)
    );
  });
});
