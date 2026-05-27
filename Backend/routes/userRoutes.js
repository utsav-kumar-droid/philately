const express = require("express");

const router = express.Router();

const multer = require("multer");

const User = require("../models/Users");

/* ======================================= */
/* MULTER STORAGE */
/* ======================================= */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
      "-" +
      file.originalname
    );
  },
});

const upload = multer({
  storage,
});

/* ======================================= */
/* GET USER */
/* ======================================= */

router.get("/:id", async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    res.json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

/* ======================================= */
/* UPDATE PROFILE PHOTO */
/* ======================================= */

router.put(

  "/photo/:id",

  upload.single("image"),

  async (req, res) => {

    try {

      const imagePath =
        req.file.filename;

      const updatedUser =
        await User.findByIdAndUpdate(

          req.params.id,

          {
            photo: imagePath,
          },

          { new: true }
        );

      res.json(updatedUser);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;