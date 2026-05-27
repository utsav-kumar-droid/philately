// server.js

const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

/* =============================== */
/* ROUTES */
/* =============================== */

const authRoutes =
  require("./routes/auth");

const postRoutes =
  require("./routes/posts");

const stampRoutes =
  require("./routes/stampRoutes");

const userRoutes =
  require("./routes/userRoutes");

const commentRoutes =
  require("./routes/comments");

/* =============================== */
/* ADMIN INIT */
/* =============================== */

const initAdmin =
  require("./utils/initAdmin");

/* =============================== */
/* CONFIG */
/* =============================== */

dotenv.config();

const app = express();

/* =============================== */
/* MIDDLEWARE */
/* =============================== */

app.use(express.json());

app.use(cookieParser());

app.use(
  express.urlencoded({
    extended:true,
  })
);

/* =============================== */
/* CORS */
/* =============================== */

app.use(

  cors({

    origin:
      process.env.CLIENT_URL ||
      "http://localhost:1234",

    credentials:true,
  })
);

/* =============================== */
/* STATIC UPLOADS */
/* =============================== */

app.use(
  "/uploads",
  express.static("uploads")
);

/* =============================== */
/* MONGODB */
/* =============================== */

mongoose

  .connect(process.env.MONGO_URI)

  .then(async()=>{

    console.log(
      "✅ MongoDB connected"
    );

    await initAdmin();
  })

  .catch((err)=>{

    console.error(

      "❌ MongoDB connection error:",

      err.message
    );
  });

/* =============================== */
/* API ROUTES */
/* =============================== */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/comments",
  commentRoutes
);

app.use(
  "/api/stamps",
  stampRoutes
);

app.use(
  "/api/users",
  userRoutes
);

/* =============================== */
/* DEFAULT ROUTE */
/* =============================== */

app.get(

  "/api",

  (req,res)=>{

    res.send(
      "🚀 API is running..."
    );
  }
);

/* =============================== */
/* GLOBAL ERROR */
/* =============================== */

app.use(
  (err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);

    const statusCode =
      err instanceof multer.MulterError ||
      err.message?.includes('Only image files are allowed')
        ? 400
        : 500;

    res.status(statusCode).json({
      success: false,
      error: err.message || 'Server Error',
    });
  }
);

/* =============================== */
/* SERVER */
/* =============================== */

const PORT =
  process.env.PORT || 5000;

app.listen(

  PORT,

  ()=>{

    console.log(

      `🚀 Server running on http://localhost:${PORT}`
    );
  }
);
