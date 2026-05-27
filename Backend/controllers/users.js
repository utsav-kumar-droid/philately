// Backend/controllers/users.js
const User = require('../models/Users'); 

// ==========================================================================
// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public / Private Authenticated
// ==========================================================================
const getUserById = async (req, res) => {
  try {
    console.log(`Fetching user by ID: ${req.params.id}`);
    
    // Expresses standard selection exclusions to prevent leak exposures
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: '⚠️ User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      user 
    });
  } catch (err) {
    console.error('❌ Error fetching user by ID:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching user profile data' 
    });
  }
};

// ==========================================================================
// @desc    Get all users with pagination
// @route   GET /api/users
// @access  Private (Admin Dashboards Only)
// ==========================================================================
const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    // Executes queries concurrently to reduce overall pipeline latency
    const [users, totalUsers] = await Promise.all([
      User.find().select('-password').skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    console.error('❌ Error fetching all users:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching platform users directory' 
    });
  }
};

module.exports = {
  getUserById,
  getAllUsers,
};