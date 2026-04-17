const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// @desc    Get buyer orders
// @route   GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyerId: req.user._id })
    .populate('artworkId', 'title imageUrl category')
    .populate('auctionId', 'currentHighestBid')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('artworkId')
    .populate('buyerId', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.buyerId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, data: order });
});

// @desc    Mark order as paid (mock payment)
// @route   PUT /api/orders/:id/pay
const payOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('artworkId', 'title artistId');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.buyerId.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  if (order.paymentStatus === 'paid') { res.status(400); throw new Error('Already paid'); }

  // Generate realistic transaction ID
  const txnId = 'TXN' + Date.now() + Math.random().toString(16).slice(2, 8).toUpperCase();
  order.paymentStatus = 'paid';
  order.paymentTransactionId = txnId;
  order.paymentDate = new Date();
  order.paymentMethod = req.body.paymentMethod || 'UPI / Online Transfer';
  const updated = await order.save();

  // Notify artist of payment
  if (order.artworkId && order.artworkId.artistId) {
    await Notification.create({
      userId: order.artworkId.artistId,
      message: `✅ Payment of ₹${order.amount.toLocaleString()} received for "${order.artworkId.title}". Transaction ID: ${txnId}`,
      type: 'payment',
      relatedId: order._id,
    });
  }

  res.json({ success: true, data: updated });
});


// @desc    Update delivery status
// @route   PUT /api/orders/:id/ship
const updateDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.deliveryStatus = req.body.deliveryStatus || order.deliveryStatus;
  if (req.body.shippingAddress) order.shippingAddress = req.body.shippingAddress;
  const updated = await order.save();
  res.json({ success: true, data: updated });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('artworkId', 'title imageUrl')
    .populate('buyerId', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
});

module.exports = { getMyOrders, getOrderById, payOrder, updateDelivery, getAllOrders };
