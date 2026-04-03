const express = require("express");
const Crop = require("../models/crop");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const CROP_CATALOG = [
  "Wheat",
  "Paddy",
  "Maize",
  "Mustard",
  "Sugarcane",
  "Cotton",
  "Soybean",
  "Rice",
  "Barley",
  "Gram",
  "Lentil",
  "Potato",
  "Onion",
  "Tomato",
  "Bajra",
  "Jowar",
  "Groundnut",
  "Sunflower",
  "Chickpea",
  "Millet",
];

const calculateGrade = (moisture) => {
  if (moisture < 12) return "Premium";
  if (moisture < 14) return "A";
  if (moisture < 16) return "B";
  return "C";
};

const buildMarketInsights = (crops) => {
  const now = new Date();
  const hourSeed = now.getHours() + now.getDate();
  const featuredTypes = ["Wheat", "Paddy", "Maize"];

  const summary = featuredTypes.map((type, index) => {
    const matchingCrops = crops.filter((crop) => crop.type === type);
    const avgPrice = matchingCrops.length
      ? Math.round(
          matchingCrops.reduce((sum, crop) => sum + Number(crop.price || 0), 0) /
            matchingCrops.length
        )
      : [2200, 2050, 1980][index];
    const quantity = matchingCrops.reduce(
      (sum, crop) => sum + Number(crop.availableQuantity ?? crop.quantity ?? 0),
      0
    );
    const trendOffset = ((hourSeed + index * 3) % 5) * 10;

    return {
      type,
      avgPrice,
      availableQuantity: Number(quantity.toFixed(2)),
      delta: trendOffset - 20,
    };
  });

  const middlemanRate = Math.round(
    summary.reduce((sum, item) => sum + item.avgPrice, 0) / summary.length - 220
  );
  const directRate = Math.round(
    summary.reduce((sum, item) => sum + item.avgPrice, 0) / summary.length
  );

  const trends = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dayIndex) => {
    const row = { day };

    summary.forEach((item, itemIndex) => {
      const wave = ((hourSeed + dayIndex + itemIndex) % 4) * 15;
      row[item.type] = item.avgPrice - 45 + dayIndex * 12 + wave;
    });

    return row;
  });

  return {
    updatedAt: now.toISOString(),
    middlemanRate,
    directRate,
    summary,
    trends,
  };
};

router.get("/market-insights", async (req, res) => {
  try {
    const crops = await Crop.find().select("type price quantity availableQuantity createdAt");
    return res.json(buildMarketInsights(crops));
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load market insights",
      error: error.message,
    });
  }
});

router.post("/add", protect, authorizeRoles("farmer"), async (req, res) => {
  try {
    const { type, quantity, moisture, price, location } = req.body;

    if (!type || quantity == null || moisture == null || price == null) {
      return res.status(400).json({ message: "Type, quantity, moisture and price are required" });
    }

    if (!CROP_CATALOG.includes(type)) {
      return res.status(400).json({ message: "Invalid crop type" });
    }

    const crop = await Crop.create({
      farmer: req.user._id,
      type,
      quantity: Number(quantity),
      availableQuantity: Number(quantity),
      moisture: Number(moisture),
      price: Number(price),
      grade: calculateGrade(Number(moisture)),
      location: location || req.user.location,
    });

    const populatedCrop = await crop.populate("farmer", "name location verified");
    return res.status(201).json(populatedCrop);
  } catch (error) {
    return res.status(500).json({ message: "Unable to add crop", error: error.message });
  }
});

router.get("/my", protect, authorizeRoles("farmer"), async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user._id })
      .populate("farmer", "name location verified")
      .sort({ createdAt: -1 });
    return res.json(crops);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load your crops", error: error.message });
  }
});

router.get("/available", protect, async (req, res) => {
  try {
    const crops = await Crop.find()
      .populate("farmer", "name location verified")
      .sort({ createdAt: -1 });

    const availableCrops = crops.filter((crop) => {
      const remainingQuantity =
        crop.availableQuantity == null ? crop.quantity : crop.availableQuantity;
      return remainingQuantity > 0;
    });

    return res.json(availableCrops);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load crops", error: error.message });
  }
});

module.exports = router;
