const axios = require("axios");
const router = require("express").Router();

router.get("/latest-rates", async (req, res) => {
  const apiKey = "f516e0cc62b0b86dd1ddbdc5e3096600";

  try {
    const response = await axios.get(
      `http://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}&symbols=USD,AUD,CAD,PLN,MXN`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch latest exchange rates" });
  }
});

module.exports = router;
