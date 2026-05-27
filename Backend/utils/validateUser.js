// utils/validateUser.js
const validator = require("validator");

function validUser(data) {
  const requiredFields = ["firstName", "emailId", "age", "password"];

  // ✅ Ensure all mandatory fields are present
  for (const field of requiredFields) {
    if (!data[field] || String(data[field]).trim() === "") {
      throw new Error(`❌ Missing required field: ${field}`);
    }
  }

  // ✅ Validate email format
  const email = data.emailId.trim().toLowerCase();
  if (!validator.isEmail(email)) {
    throw new Error("❌ Invalid email format");
  }

  // ✅ Validate strong password
  if (
    !validator.isStrongPassword(data.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "❌ Weak password: must include at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol"
    );
  }

  // ✅ Validate name length
  const nameLength = data.firstName.trim().length;
  if (nameLength < 3 || nameLength > 20) {
    throw new Error("❌ First name must be between 3 and 20 characters");
  }

  // ✅ Validate lastName (if provided)
  if (data.lastName && data.lastName.trim().length > 30) {
    throw new Error("❌ Last name cannot exceed 30 characters");
  }

  // ✅ Validate age range (14–70, per schema)
  const age = Number(data.age);
  if (!validator.isInt(age.toString(), { min: 14, max: 70 })) {
    throw new Error("❌ Age must be a valid number between 14 and 70");
  }

  return {
    ...data,
    emailId: email, // normalized
    firstName: data.firstName.trim(),
    lastName: data.lastName?.trim() || "",
  };
}

module.exports = validUser;

