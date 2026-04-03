const mongoose = require("mongoose");
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

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: CROP_CATALOG,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    moisture: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    grade: {
      type: String,
      enum: ["Premium", "A", "B", "C"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Crop", cropSchema);
