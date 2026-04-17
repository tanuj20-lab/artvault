const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  artworkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startingBid: { type: Number, required: true },
  currentHighestBid: { type: Number, default: 0 },
  highestBidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  auctionEndDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'ended', 'cancelled'], default: 'active' },
  winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Auction', auctionSchema);
