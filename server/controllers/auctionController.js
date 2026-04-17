const asyncHandler = require('express-async-handler');
const Auction = require('../models/Auction');
const Artwork = require('../models/Artwork');
const determineWinner = require('../utils/determineWinner');

// @desc    Create auction
// @route   POST /api/auctions
const createAuction = asyncHandler(async (req, res) => {
  const { artworkId, startingBid, auctionEndDate } = req.body;
  const artwork = await Artwork.findById(artworkId);
  if (!artwork) { res.status(404); throw new Error('Artwork not found'); }
  if (artwork.artistId.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not your artwork');
  }
  if (artwork.status !== 'available') {
    res.status(400); throw new Error('Artwork is not available for auction');
  }
  const auction = await Auction.create({
    artworkId, artistId: req.user._id,
    startingBid: Number(startingBid),
    currentHighestBid: Number(startingBid),
    auctionEndDate: new Date(auctionEndDate),
  });
  await Artwork.findByIdAndUpdate(artworkId, { status: 'auction' });
  const populated = await auction.populate([
    { path: 'artworkId', populate: { path: 'artistId', select: 'name' } }
  ]);
  res.status(201).json({ success: true, data: populated });
});

// @desc    Get all active auctions
// @route   GET /api/auctions
const getAuctions = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : { status: 'active' };
  const auctions = await Auction.find(query)
    .populate({ path: 'artworkId', populate: { path: 'artistId', select: 'name avatar' } })
    .populate('highestBidderId', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: auctions.length, data: auctions });
});

// @desc    Get single auction
// @route   GET /api/auctions/:id
const getAuctionById = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id)
    .populate({ path: 'artworkId', populate: { path: 'artistId', select: 'name avatar bio' } })
    .populate('highestBidderId', 'name')
    .populate('winnerId', 'name');
  if (!auction) { res.status(404); throw new Error('Auction not found'); }
  res.json({ success: true, data: auction });
});

// @desc    End auction and declare winner
// @route   PUT /api/auctions/:id/end
const endAuction = asyncHandler(async (req, res) => {
  const auction = await Auction.findById(req.params.id);
  if (!auction) { res.status(404); throw new Error('Auction not found'); }
  if (auction.artistId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized to end this auction');
  }
  const result = await determineWinner(req.params.id);
  res.json({ success: true, data: result });
});

// @desc    Get artist's auctions
// @route   GET /api/auctions/my
const getMyAuctions = asyncHandler(async (req, res) => {
  const auctions = await Auction.find({ artistId: req.user._id })
    .populate('artworkId', 'title imageUrl')
    .populate('highestBidderId', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: auctions.length, data: auctions });
});

module.exports = { createAuction, getAuctions, getAuctionById, endAuction, getMyAuctions };
