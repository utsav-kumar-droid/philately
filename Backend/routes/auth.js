const express = require("express");

const router = express.Router();

const {

  register,

  login,

  getUser,

} = require("../controllers/auth");

const auth =
  require("../middleware/auth");

/* ======================== */
/* REGISTER */
/* ======================== */

router.post(

  "/register",

  register
);

/* ======================== */
/* LOGIN */
/* ======================== */

router.post(

  "/login",

  login
);

/* ======================== */
/* GET USER */
/* ======================== */

router.get(

  "/user",

  auth,

  getUser
);

/* ======================== */
/* EXPORT */
/* ======================== */

module.exports = router;



