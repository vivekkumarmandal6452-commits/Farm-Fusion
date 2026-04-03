const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/market-ai", require("./routes/marketAiRoutes"));



app.get("/", (req, res) => {
  res.json({
    message: "Direct Farmer-to-Factory Marketplace API is running",
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/crops", require("./routes/cropRoutes"));
app.use("/api/deals", require("./routes/dealRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    message: "Something went wrong",
    error: error.message,
  });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect database:", error.message);
    process.exit(1);
  });
