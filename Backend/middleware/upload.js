// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ensure "uploads" folder exists
  },
  filename: (req, file, cb) => {
    // Prevent filename conflicts
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Optional: file filter (allow only images)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const imageExtRegex = /\.(jpeg|jpg|png|gif|webp|svg|bmp|tiff|heic|heif)$/;

  if (file.mimetype?.startsWith('image/') || imageExtRegex.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('❌ Only image files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

