const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["farmer", "company"],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const ratingSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    review: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    ratedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const dealSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    requestedQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryLocation: {
      type: String,
      trim: true,
      default: "",
    },
    deliveryInstructions: {
      type: String,
      trim: true,
      default: "",
    },
    companyNotes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["inquiry", "locked", "completed"],
      default: "locked",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    transportMode: {
      type: String,
      enum: ["company_pickup", "platform_delivery"],
      default: "company_pickup",
    },
    commissionPercent: {
      type: Number,
      default: 1,
    },
    workerSharePercent: {
      type: Number,
      default: 0,
    },
    workerShareAmount: {
      type: Number,
      default: 0,
    },
    platformFeeAmount: {
      type: Number,
      default: 0,
    },
    qualityRating: {
      type: ratingSchema,
      default: null,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Deal", dealSchema);
