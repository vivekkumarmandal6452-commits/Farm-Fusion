const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { protect } = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "farmer-market-demo-secret";

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "7d",
  });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  location: user.location,
  phone: user.phone || "",
  verified: user.verified,
  createdAt: user.createdAt,
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, location, phone = "" } = req.body;
    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").toLowerCase().trim();
    const normalizedLocation = String(location || "").trim();
    const normalizedRole = String(role || "").toLowerCase().trim();

    if (!normalizedName || !normalizedEmail || !password || !normalizedRole || !normalizedLocation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["farmer", "company"].includes(normalizedRole)) {
      return res.status(400).json({ message: "Role must be Farmer or Company" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      existingUser.name = normalizedName;
      existingUser.role = normalizedRole;
      existingUser.location = normalizedLocation;
      existingUser.phone = String(phone || "").trim();
      existingUser.password = password;
      await existingUser.save();

      return res.status(200).json({
        token: signToken(existingUser._id),
        user: sanitizeUser(existingUser),
      });
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: normalizedRole,
      location: normalizedLocation,
      phone: String(phone || "").trim(),
    });

    return res.status(201).json({
      token: signToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }

    if (error?.name === "ValidationError") {
      const firstError = Object.values(error.errors || {})[0];
      return res.status(400).json({ message: firstError?.message || "Invalid registration details" });
    }

    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedRole = role ? String(role).toLowerCase().trim() : "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let passwordValid = await user.comparePassword(password);

    // Support older accounts that may still have plaintext passwords from previous project versions.
    if (!passwordValid && user.password === password) {
      passwordValid = true;
      user.password = password;
      await user.save();
    }

    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (normalizedRole && String(user.role).toLowerCase() !== normalizedRole) {
      return res.status(403).json({ message: "Selected role does not match this account" });
    }

    return res.json({
      token: signToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email, role, newPassword } = req.body;
    const normalizedEmail = String(email || "").toLowerCase().trim();
    const normalizedRole = String(role || "").toLowerCase().trim();

    if (!normalizedEmail || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (normalizedRole && String(user.role).toLowerCase() !== normalizedRole) {
      return res.status(403).json({ message: "Selected role does not match this account" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      message: "Password reset successful. You can login now.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to reset password", error: error.message });
  }
});

router.get("/me", protect, async (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
});

router.patch("/profile", protect, async (req, res) => {
  try {
    const { name, location, phone } = req.body;

    if (name !== undefined) {
      req.user.name = String(name || "").trim() || req.user.name;
    }

    if (location !== undefined) {
      req.user.location = String(location || "").trim() || req.user.location;
    }

    if (phone !== undefined) {
      req.user.phone = String(phone || "").trim();
    }

    await req.user.save();

    return res.json({
      message: "Profile updated successfully",
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update profile", error: error.message });
  }
});

module.exports = router;
