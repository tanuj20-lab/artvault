const express = require('express');
const router = express.Router();
const { placeBid, getBidsByAuction, getMyBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');
const { requireBuyer } = require('../middleware/roleMiddleware');

router.post('/', protect, requireBuyer, placeBid);
router.get('/my', protect, requireBuyer, getMyBids);
router.get('/auction/:auctionId', getBidsByAuction);

module.exports = router;
