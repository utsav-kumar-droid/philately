// utils/initAdmin.js
const bcrypt = require("bcryptjs");
const User = require("../models/Users");

const initAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const age = parseInt(process.env.ADMIN_AGE, 10) || 30;
    const name = process.env.ADMIN_FIRST_NAME?.trim() || "Admin";

    if (!email || !password) {
      console.warn("⚠️ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
      return;
    }

    const existing = await User.findOne({ emailId: email });

    if (!existing) {
      const hashed = await bcrypt.hash(password, 10);
      const adminUser = await User.create({
        firstName: name,
        emailId: email,
        password: hashed,
        age,
        role: "admin",
      });

      console.log(`🛡️ Admin user created: ${adminUser.emailId}`);
    } else {
      console.log(`👑 Admin already exists: ${existing.emailId}`);
    }
  } catch (err) {
    console.error("❌ Error initializing admin user:", err.message);
  }
};

module.exports = initAdmin;

