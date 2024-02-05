const axios = require("axios");
const router = require("express").Router();
const mongoose = require("mongoose");

const HistoricalData = mongoose.model("HistoricalData", {
  date: String,
  rates: Object,
});

router.get("/historical-rates", async (req, res) => {
  const apiKey = "f516e0cc62b0b86dd1ddbdc5e3096600";
  const targetSymbols = "USD,CAD,EUR";

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const historicalDate = sevenDaysAgo.toISOString().split("T")[0];

  try {
    const existingData = await HistoricalData.findOne({ date: historicalDate });

    if (existingData) {
      res.json(existingData);
    } else {
      const response = await axios.get(
        `http://api.exchangeratesapi.io/v1/${historicalDate}?access_key=${apiKey}&symbols=${targetSymbols}`
      );

      const historicalData = new HistoricalData({
        date: historicalDate,
        rates: response.data.rates,
      });
      await historicalData.save();

      res.json(historicalData);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to fetch historical exchange rates data" });
  }
});

router.get("/historical-data/:date", async (req, res) => {
  const requestedDate = req.params.date;

  try {
    const historicalData = await HistoricalData.findOne({
      date: requestedDate,
    });

    if (historicalData) {
      res.json(historicalData);
    } else {
      res
        .status(404)
        .json({ error: "Historical data not found for the requested date" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error while querying historical data" });
  }
});

module.exports = router;
