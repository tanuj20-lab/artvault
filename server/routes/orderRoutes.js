const express = require('express');
const router = express.Router();
const { getMyOrders, getOrderById, payOrder, updateDelivery, getAllOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin, requireArtistOrAdmin } = require('../middleware/roleMiddleware');

router.get('/', protect, requireAdmin, getAllOrders);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, payOrder);
router.put('/:id/ship', protect, requireArtistOrAdmin, updateDelivery);

module.exports = router;
