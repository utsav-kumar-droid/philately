const jwt = require('jsonwebtoken');
const User = require('../models/Users');

// ===========================
// @desc    Authentication Middleware
// ===========================
const userAuth = async (req, res, next) => {
  try {
    let token;

    // ✅ Check Authorization header (Bearer token)
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // ✅ Fallback to cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '❌ No token provided, authorization denied',
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract user ID from token payload
    const userId = decoded.id || decoded._id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: '❌ Invalid token payload',
      });
    }

    // ✅ Find user in DB, exclude password
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '❌ User not found',
      });
    }

    // ✅ Attach user info to request object
    req.user = user;       // full user object without password
    req.result = user;     // for controller compatibility
    req.userId = user._id; // easy access to ID

    next();
  } catch (err) {
    console.error('🔒 Auth middleware error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '❌ Token expired, please login again',
      });
    }

    res.status(401).json({
      success: false,
      message: '❌ Invalid or expired token',
    });
  }
};

module.exports = userAuth;





