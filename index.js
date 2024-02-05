const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const converterRoute = require("./routes/converter");
const ratesRoute = require("./routes/rates");
const symbolRoute = require("./routes/symbol");
const historicalRoute = require("./routes/historical");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

dotenv.config();

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(limiter);

app.use("/api/users", userRoute);
app.use("/api/converter", converterRoute);
app.use("/api/rates", ratesRoute);
app.use("/api/symbol", symbolRoute);
app.use("/api/historical", historicalRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
