const asyncHandler = require('express-async-handler');
const Bid = require('../models/Bid');
const Auction = require('../models/Auction');
const Notification = require('../models/Notification');

// @desc    Place a bid
// @route   POST /api/bids
const placeBid = asyncHandler(async (req, res) => {
  const { auctionId, bidAmount } = req.body;
  const auction = await Auction.findById(auctionId).populate('artworkId', 'title artistId');
  if (!auction) { res.status(404); throw new Error('Auction not found'); }
  if (auction.status !== 'active') { res.status(400); throw new Error('Auction is not active'); }
  if (new Date() > new Date(auction.auctionEndDate)) { res.status(400); throw new Error('Auction has ended'); }
  if (Number(bidAmount) <= auction.currentHighestBid) {
    res.status(400);
    throw new Error(`Bid must be higher than current highest bid of ₹${auction.currentHighestBid}`);
  }
  if (auction.artistId && auction.artistId.toString() === req.user._id.toString()) {
    res.status(400); throw new Error('Artists cannot bid on their own artwork');
  }

  const bid = await Bid.create({ auctionId, buyerId: req.user._id, bidAmount: Number(bidAmount) });

  // Update auction
  auction.currentHighestBid = Number(bidAmount);
  auction.highestBidderId = req.user._id;
  await auction.save();

  // Notify artist
  const targetArtistId = auction.artworkId?.artistId || auction.artistId;
  const targetTitle = auction.artworkId?.title || 'Unknown Artwork';
  
  if (targetArtistId) {
    await Notification.create({
      userId: targetArtistId,
      message: `💰 A new bid of ₹${Number(bidAmount).toLocaleString()} was placed on your artwork "${targetTitle}".`,
      type: 'bid',
      relatedId: auction._id,
    });
  }

  // Emit socket event
  if (req.app.get('io')) {
    req.app.get('io').to(auctionId).emit('newBid', {
      auctionId,
      bidAmount: Number(bidAmount),
      bidder: req.user.name,
      timestamp: new Date(),
    });
  }

  const populated = await bid.populate('buyerId', 'name');
  res.status(201).json({ success: true, data: populated, auction });
});

// @desc    Get bids for an auction
// @route   GET /api/bids/auction/:auctionId
const getBidsByAuction = asyncHandler(async (req, res) => {
  const bids = await Bid.find({ auctionId: req.params.auctionId })
    .populate('buyerId', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: bids.length, data: bids });
});

// @desc    Get buyer's bids
// @route   GET /api/bids/my
const getMyBids = asyncHandler(async (req, res) => {
  const bids = await Bid.find({ buyerId: req.user._id })
    .populate({ path: 'auctionId', populate: { path: 'artworkId', select: 'title imageUrl' } })
    .sort({ createdAt: -1 });
  res.json({ success: true, count: bids.length, data: bids });
});

module.exports = { placeBid, getBidsByAuction, getMyBids };
