// Run this ONCE to create the instructor's admin account: node utils/seedAdmin.js
// Edit the values below first, then delete this file (or just don't run it again) after use.

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const ADMIN_NAME = "Tabiullah Khan"; // change if needed
const ADMIN_EMAIL = "khantabiullah1@gmail.com"; // change to the instructor's real email
const ADMIN_PASSWORD = "tabi4321"; // change before running, then change again after first login

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log("An account with this email already exists. No changes made.");
    process.exit(0);
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });

  console.log(`Admin account created: ${ADMIN_EMAIL}`);
  process.exit(0);
};

seedAdmin();
