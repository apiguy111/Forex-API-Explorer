const axios = require("axios");
const router = require("express").Router();

router.get("/currency", async (req, res) => {
  const { sourceCurrency, targetCurrency, amount } = req.query;

  const apiKey = "f516e0cc62b0b86dd1ddbdc5e3096600";

  try {
    const response = await axios.get(
      `http://api.exchangeratesapi.io/v1/convert?access_key=${apiKey}&from=${sourceCurrency}&to=${targetCurrency}&amount=${amount}`
    );

    console.log("API Response:", response.data);

    if (response.data.result) {
      const convertedAmount = response.data.result;
      res.json({ convertedAmount });
    } else {
      console.log("Invalid Conversion Data:", response.data);
      res.status(400).json({ error: "Invalid conversion data" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Unable to fetch exchange rate data" });
  }
});

module.exports = router;
