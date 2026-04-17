const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Artwork = require('../models/Artwork');
const Auction = require('../models/Auction');
const Order = require('../models/Order');
const Bid = require('../models/Bid');

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  await user.deleteOne();
  res.json({ success: true, message: 'User removed' });
});

// @desc    Get platform stats
// @route   GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalArtworks, totalAuctions, totalOrders, totalBids] = await Promise.all([
    User.countDocuments(),
    Artwork.countDocuments(),
    Auction.countDocuments(),
    Order.countDocuments(),
    Bid.countDocuments(),
  ]);
  const artists = await User.countDocuments({ role: 'artist' });
  const buyers = await User.countDocuments({ role: 'buyer' });
  const activeAuctions = await Auction.countDocuments({ status: 'active' });
  const paidOrders = await Order.find({ paymentStatus: 'paid' });
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

  res.json({
    success: true,
    data: { totalUsers, artists, buyers, totalArtworks, totalAuctions, activeAuctions, totalOrders, totalBids, totalRevenue },
  });
});

// @desc    Get all artworks (admin)
// @route   GET /api/admin/artworks
const getAllArtworks = asyncHandler(async (req, res) => {
  const artworks = await Artwork.find({}).populate('artistId', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, count: artworks.length, data: artworks });
});

module.exports = { getAllUsers, toggleUserStatus, deleteUser, getStats, getAllArtworks };
