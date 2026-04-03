const crypto = require("crypto");
const express = require("express");
const Crop = require("../models/crop");
const Deal = require("../models/deal");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

const generateTransactionId = () => `0x${crypto.randomBytes(3).toString("hex")}`;
const populateDeal = [
  { path: "farmer", select: "name email location verified" },
  { path: "company", select: "name email location verified" },
  { path: "crop" },
  { path: "messages.sender", select: "name email role" },
];

const isParticipant = (deal, userId) =>
  deal.farmer._id.toString() === userId.toString() ||
  deal.company._id.toString() === userId.toString();

router.post("/lock", protect, authorizeRoles("company"), async (req, res) => {
  try {
    const {
      cropId,
      requestedQuantity,
      deliveryLocation,
      deliveryInstructions = "",
      companyNotes = "",
      transportMode = "company_pickup",
    } = req.body;

    if (!cropId) {
      return res.status(400).json({ message: "cropId is required" });
    }

    if (!requestedQuantity || Number(requestedQuantity) <= 0) {
      return res.status(400).json({ message: "requestedQuantity must be greater than 0" });
    }

    if (!deliveryLocation || !deliveryLocation.trim()) {
      return res.status(400).json({ message: "deliveryLocation is required" });
    }

    if (!["company_pickup", "platform_delivery"].includes(transportMode)) {
      return res.status(400).json({ message: "Invalid transportMode" });
    }

    const crop = await Crop.findById(cropId).populate("farmer", "name email location verified");

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    const remainingQuantity = crop.availableQuantity == null ? crop.quantity : crop.availableQuantity;

    if (remainingQuantity <= 0) {
      return res.status(404).json({ message: "Crop not found" });
    }

    if (Number(requestedQuantity) > remainingQuantity) {
      return res.status(400).json({
        message: `Only ${remainingQuantity} tons are available for this crop`,
      });
    }

    const commissionPercent = transportMode === "platform_delivery" ? 3 : 1;
    const workerSharePercent = transportMode === "platform_delivery" ? 2 : 0;
    const totalAmount = Number(crop.price) * Number(requestedQuantity);
    const platformFeeAmount = Number(((totalAmount * commissionPercent) / 100).toFixed(2));
    const workerShareAmount = Number(((totalAmount * workerSharePercent) / 100).toFixed(2));

    const deal = await Deal.create({
      farmer: crop.farmer._id,
      company: req.user._id,
      crop: crop._id,
      price: crop.price,
      requestedQuantity: Number(requestedQuantity),
      totalAmount,
      deliveryLocation: deliveryLocation.trim(),
      deliveryInstructions: deliveryInstructions.trim(),
      companyNotes: companyNotes.trim(),
      status: "locked",
      transactionId: generateTransactionId(),
      transportMode,
      commissionPercent,
      workerSharePercent,
      workerShareAmount,
      platformFeeAmount,
      messages: [
        {
          sender: req.user._id,
          senderRole: req.user.role,
          text: `Order placed for ${requestedQuantity} tons. Delivery location: ${deliveryLocation.trim()}`,
        },
      ],
    });

    crop.availableQuantity = Number((remainingQuantity - Number(requestedQuantity)).toFixed(2));
    await crop.save();

    const populatedDeal = await Deal.findById(deal._id).populate(populateDeal);

    return res.status(201).json(populatedDeal);
  } catch (error) {
    return res.status(500).json({ message: "Unable to lock deal", error: error.message });
  }
});

router.post("/inquiry", protect, authorizeRoles("company"), async (req, res) => {
  try {
    const { cropId, text = "" } = req.body;

    if (!cropId) {
      return res.status(400).json({ message: "cropId is required" });
    }

    const crop = await Crop.findById(cropId).populate("farmer", "name email location verified");

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    const existingInquiry = await Deal.findOne({
      crop: crop._id,
      company: req.user._id,
      status: "inquiry",
    }).populate(populateDeal);

    if (existingInquiry) {
      if (text.trim()) {
        existingInquiry.messages.push({
          sender: req.user._id,
          senderRole: req.user.role,
          text: text.trim(),
        });
        await existingInquiry.save();
        await existingInquiry.populate(populateDeal);
      }

      return res.json(existingInquiry);
    }

    const inquiryDeal = await Deal.create({
      farmer: crop.farmer._id,
      company: req.user._id,
      crop: crop._id,
      price: crop.price,
      requestedQuantity: 0,
      totalAmount: 0,
      deliveryLocation: "",
      deliveryInstructions: "",
      companyNotes: "",
      status: "inquiry",
      transactionId: generateTransactionId(),
      transportMode: "company_pickup",
      commissionPercent: 0,
      workerSharePercent: 0,
      workerShareAmount: 0,
      platformFeeAmount: 0,
      messages: [
        {
          sender: req.user._id,
          senderRole: req.user.role,
          text: text.trim() || `Inquiry started for ${crop.type}.`,
        },
      ],
    });

    const populatedInquiry = await inquiryDeal.populate(populateDeal);
    return res.status(201).json(populatedInquiry);
  } catch (error) {
    return res.status(500).json({ message: "Unable to start inquiry", error: error.message });
  }
});

router.get("/company", protect, authorizeRoles("company"), async (req, res) => {
  try {
    const deals = await Deal.find({ company: req.user._id })
      .populate(populateDeal)
      .sort({ createdAt: -1 });

    return res.json(deals);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load company deals", error: error.message });
  }
});

router.get("/farmer", protect, authorizeRoles("farmer"), async (req, res) => {
  try {
    const deals = await Deal.find({ farmer: req.user._id })
      .populate(populateDeal)
      .sort({ createdAt: -1 });

    return res.json(deals);
  } catch (error) {
    return res.status(500).json({ message: "Unable to load farmer deals", error: error.message });
  }
});

router.post("/:dealId/messages", protect, async (req, res) => {
  try {
    const { dealId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const deal = await Deal.findById(dealId).populate(populateDeal);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (!isParticipant(deal, req.user._id)) {
      return res.status(403).json({ message: "You are not allowed to message on this deal" });
    }

    deal.messages.push({
      sender: req.user._id,
      senderRole: req.user.role,
      text: text.trim(),
    });

    await deal.save();
    await deal.populate(populateDeal);

    return res.json(deal);
  } catch (error) {
    return res.status(500).json({ message: "Unable to send message", error: error.message });
  }
});

router.patch("/:dealId/rating", protect, authorizeRoles("company"), async (req, res) => {
  try {
    const { dealId } = req.params;
    const { score, review = "" } = req.body;

    if (!score || Number(score) < 1 || Number(score) > 5) {
      return res.status(400).json({ message: "score must be between 1 and 5" });
    }

    const deal = await Deal.findById(dealId).populate(populateDeal);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (deal.company._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the company can rate this deal" });
    }

    deal.qualityRating = {
      score: Number(score),
      review: review.trim(),
      ratedAt: new Date(),
    };
    await deal.save();
    await deal.populate(populateDeal);

    return res.json(deal);
  } catch (error) {
    return res.status(500).json({ message: "Unable to save rating", error: error.message });
  }
});

module.exports = router;
