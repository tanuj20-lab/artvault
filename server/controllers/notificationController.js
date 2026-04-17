const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: notifications.length, data: notifications });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
const markRead = asyncHandler(async (req, res) => {
  const n = await Notification.findById(req.params.id);
  if (!n) { res.status(404); throw new Error('Notification not found'); }
  n.isRead = true;
  await n.save();
  res.json({ success: true, data: n });
});

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});

module.exports = { getNotifications, markRead, markAllRead };
