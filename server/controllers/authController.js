const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('Please provide all required fields');
  }
  const userExists = await User.findOne({ email });
  if (userExists) { res.status(400); throw new Error('User already exists with this email'); }

  const allowedRoles = ['artist', 'buyer'];
  const userRole = allowedRoles.includes(role) ? role : 'buyer';

  const user = await User.create({ name, email, password, role: userRole });
  res.status(201).json({
    success: true,
    data: {
      _id: user._id, name: user.name, email: user.email,
      role: user.role, token: generateToken(user._id),
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id, name: user.name, email: user.email,
        role: user.role, avatar: user.avatar, bio: user.bio,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401); throw new Error('Invalid email or password');
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.name = req.body.name || user.name;
  user.bio = req.body.bio || user.bio;
  if (req.body.password) user.password = req.body.password;
  const updatedUser = await user.save();
  res.json({
    success: true,
    data: { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, bio: updatedUser.bio },
  });
});

module.exports = { register, login, getMe, updateProfile };
