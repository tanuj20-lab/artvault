const express = require('express');
const router = express.Router();
const { createAuction, getAuctions, getAuctionById, endAuction, getMyAuctions } = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');
const { requireArtist, requireArtistOrAdmin } = require('../middleware/roleMiddleware');

router.get('/', getAuctions);
router.get('/my', protect, requireArtist, getMyAuctions);
router.get('/:id', getAuctionById);
router.post('/', protect, requireArtist, createAuction);
router.put('/:id/end', protect, requireArtistOrAdmin, endAuction);

module.exports = router;
