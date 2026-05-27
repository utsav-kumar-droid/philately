// ===========================
// @desc    Middleware to check admin role
// ===========================
const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '❌ Access denied: Admins only',
      });
    }
    next();
  } catch (err) {
    console.error('🔒 isAdmin middleware error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while checking admin access',
    });
  }
};

module.exports = isAdmin;

