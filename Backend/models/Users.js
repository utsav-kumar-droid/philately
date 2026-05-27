// models/Users.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

/* ===================================================== */
/* ADDRESS SUBSCHEMA */
/* ===================================================== */
const addressSchema = new Schema(
  {
    fullName: String,
    mobile: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: "India",
    },
  },
  { _id: false }
);

/* ===================================================== */
/* CART ITEM SUBSCHEMA */
/* ===================================================== */
const cartItemSchema = new Schema(
  {
    stamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stamp",
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

/* ===================================================== */
/* MAIN USER SCHEMA */
/* ===================================================== */
const userSchema = new Schema(
  {
    /* ========================= */
    /* BASIC INFO                */
    /* ========================= */
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: [20, "First name cannot exceed 20 characters"],
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [14, "Minimum age is 14"],
      max: [70, "Maximum age is 70"],
    },

    emailId: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [
        6,
        "Password must be at least 6 characters long",
      ],
      select: false,
    },

    /* ========================= */
    /* PROFILE                   */
    /* ========================= */
    photo: {
      type: String,
      default: "https://via.placeholder.com/150",
    },

    coverPhoto: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    /* ========================= */
    /* ROLE                      */
    /* ========================= */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    /* ========================= */
    /* WALLET                    */
    /* ========================= */
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },

    walletHistory: [
      {
        type: {
          type: String,
          enum: ["credit", "debit", "refund"],
        },
        amount: Number,
        description: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* ========================= */
    /* ADDRESS CONTAINER         */
    /* ========================= */
    addresses: [addressSchema],

    defaultAddressIndex: {
      type: Number,
      default: 0,
    },

    /* ========================= */
    /* CART RELATIONS            */
    /* ========================= */
    cart: [cartItemSchema],

    /* ========================= */
    /* ORDERS REFERENCE          */
    /* ========================= */
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    /* ========================= */
    /* WISHLIST REFERENCE        */
    /* ========================= */
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stamp",
      },
    ],

    /* ========================= */
    /* ACCOUNT STATUS            */
    /* ========================= */
    isBlocked: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },

    /* ========================= */
    /* SOCIAL SIGN-ON CONNECTIONS*/
    /* ========================= */
    googleId: {
      type: String,
      default: null,
    },

    /* ========================= */
    /* PREMIUM MEMBERSHIPS       */
    /* ========================= */
    membership: {
      type: String,
      enum: ["basic", "premium"],
      default: "basic",
    },
  },
  {
    timestamps: true,
  }
);

/* ======================================= */
/* MIDDLEWARE: HASH PASSWORD BEFORE SAVE   */
/* ======================================= */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

/* ======================================= */
/* MIDDLEWARE: NORMALIZE EMAIL STRINGS     */
/* ======================================= */
userSchema.pre("save", function (next) {
  if (this.emailId) {
    this.emailId = this.emailId.trim().toLowerCase();
  }
  next();
});

/* ======================================= */
/* METHOD: VERIFY CRYPTOGRAPHIC PASSWORD   */
/* ======================================= */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error("User has no password set");
  }
  return bcrypt.compare(candidatePassword, this.password);
};

/* ======================================= */
/* SCHEMA FORMATTER: OMIT SENSITIVE DATA    */
/* ======================================= */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

/* ======================================= */
/* COMPILE AND EXPORT UNIQUE MODEL INSTANCE */
/* ======================================= */
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;



