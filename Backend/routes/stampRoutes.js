// routes/stampRoutes.js

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

/* ===================================================== */
/* STAMP MODEL */
/* ===================================================== */

const stampSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "General",
    },

    stock: {
      type: Number,
      default: 1,
    },

    createdBy: {
      type: String,
      default: "admin",
    },

    available: {
      type: Boolean,
      default: true,
    },

    isLive: {
      type: Boolean,
      default: false,
    },

    /* 🎙️ ADDED THE AUDIO FIELD TRACKER TO YOUR SCHEMAS PERMANENTLY */
    audioUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Stamp =
  mongoose.models.Stamp ||
  mongoose.model(
    "Stamp",
    stampSchema
  );

/* ===================================================== */
/* TEMP USER DATA */
/* ===================================================== */
let cart = [];
let wishlist = [];
let orders = [];

/* ===================================================== */
/* GET ALL STAMPS */
/* ===================================================== */
router.get("/", async (req, res) => {
  try {
    const stamps = await Stamp.find().sort({
      createdAt: -1,
    });
    res.status(200).json(stamps);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stamps",
      error: error.message,
    });
  }
});

/* ===================================================== */
/* GET SINGLE STAMP */
/* ===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const stamp = await Stamp.findById(req.params.id);
    if (!stamp) {
      return res.status(404).json({
        message: "Stamp not found",
      });
    }
    res.status(200).json(stamp);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stamp",
      error: error.message,
    });
  }
});

/* ===================================================== */
/* ADMIN - CREATE STAMP */
/* ===================================================== */
router.post("/", async (req, res) => {
  try {
    const newStamp = new Stamp({
      title: req.body.title,
      description: req.body.description,
      country: req.body.country,
      year: req.body.year,
      price: req.body.price,
      image: req.body.image,
      category: req.body.category,
      stock: req.body.stock,
      available: req.body.available !== undefined ? req.body.available : true,
      isLive: req.body.isLive !== undefined ? req.body.isLive : false,
      
      /* 🎙️ CAPTURE AND PARSE INPUT TO PERMANENTLY SAVE TO BACKEND MONGO PIPELINE */
      audioUrl: req.body.audioUrl !== undefined ? req.body.audioUrl : "",
    });

    const savedStamp = await newStamp.save();
    res.status(201).json(savedStamp);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create stamp",
      error: error.message,
    });
  }
});

/* ===================================================== */
/* ADMIN - UPDATE STAMP */
/* ===================================================== */
router.put("/:id", async (req, res) => {
  try {
    const updatedStamp = await Stamp.findByIdAndUpdate(
      req.params.id,
      req.body, // This passes req.body directly, meaning audioUrl updates will work smoothly now!
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStamp) {
      return res.status(404).json({
        message: "Stamp not found",
      });
    }

    res.status(200).json(updatedStamp);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update stamp",
      error: error.message,
    });
  }
});

/* ===================================================== */
/* ADMIN - DELETE STAMP */
/* ===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const deletedStamp = await Stamp.findByIdAndDelete(req.params.id);
    if (!deletedStamp) {
      return res.status(404).json({
        message: "Stamp not found",
      });
    }
    res.status(200).json({
      message: "Stamp deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete stamp",
      error: error.message,
    });
  }
});

/* ===================================================== */
/* USER - ADD TO CART */
/* ===================================================== */
router.post("/cart/add", async (req, res) => {
  try {
    const stamp = await Stamp.findById(req.body.stampId);
    if (!stamp) {
      return res.status(404).json({
        message: "Stamp not found",
      });
    }

    const existing = cart.find((item) => item.stampId === req.body.stampId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        stampId: stamp._id,
        title: stamp.title,
        price: stamp.price,
        quantity: 1,
      });
    }

    res.status(200).json({
      message: "Added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add to cart",
      error: error.message,
    });
  }
});

/* ===================================================== */
/* GET CART */
/* ===================================================== */
router.get("/cart/all", (req, res) => {
  res.status(200).json(cart);
});

/* ===================================================== */
/* REMOVE FROM CART */
/* ===================================================== */
router.delete("/cart/remove/:id", (req, res) => {
  cart = cart.filter((item) => item.stampId != req.params.id);
  res.status(200).json({
    message: "Removed from cart",
    cart,
  });
});

/* ===================================================== */
/* ADD TO WISHLIST */
/* ===================================================== */
router.post("/wishlist/add", async (req, res) => {
  try {
    const stamp = await Stamp.findById(req.body.stampId);
    if (!stamp) {
      return res.status(404).json({
        message: "Stamp not found",
      });
    }

    const exists = wishlist.find((item) => item.stampId == req.body.stampId);
    if (exists) {
      return res.status(400).json({
        message: "Already in wishlist",
      });
    }

    wishlist.push({
      stampId: stamp._id,
      title: stamp.title,
      image: stamp.image,
      price: stamp.price,
    });

    res.status(200).json({
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add wishlist",
      error: error.message,
    });
  }
});

/* ===================================================== */
/* GET WISHLIST */
/* ===================================================== */
router.get("/wishlist/all", (req, res) => {
  res.status(200).json(wishlist);
});

/* ===================================================== */
/* REMOVE FROM WISHLIST */
/* ===================================================== */
router.delete("/wishlist/remove/:id", (req, res) => {
  wishlist = wishlist.filter((item) => item.stampId != req.params.id);
  res.status(200).json({
    message: "Removed from wishlist",
    wishlist,
  });
});

/* ===================================================== */
/* BUY STAMPS */
/* ===================================================== */
router.post("/buy", async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = {
      id: Date.now(),
      items,
      address,
      paymentMethod,
      total,
      createdAt: new Date(),
    };

    orders.push(order);
    cart = [];

    res.status(200).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Purchase failed",
      error: error.message,
    });
  }
});

/* ===================================================== */
/* GET ALL ORDERS */
/* ===================================================== */
router.get("/orders/all", (req, res) => {
  res.status(200).json(orders);
});

module.exports = router;


