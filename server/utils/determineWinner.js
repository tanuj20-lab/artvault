const Auction = require('../models/Auction');
const Artwork = require('../models/Artwork');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

const determineWinner = async (auctionId) => {
  const auction = await Auction.findById(auctionId).populate('artworkId');
  if (!auction || auction.status !== 'active') return null;

  auction.status = 'ended';

  const targetArtworkId = auction.artworkId ? auction.artworkId._id : null;
  const targetTitle = auction.artworkId ? auction.artworkId.title : 'Unknown Artwork';
  const targetArtistId = auction.artworkId ? auction.artworkId.artistId : auction.artistId;

  if (auction.highestBidderId && auction.currentHighestBid > 0) {
    auction.winnerId = auction.highestBidderId;

    // Create order for winner
    let order = null;
    if (targetArtworkId) {
      order = await Order.create({
        buyerId: auction.highestBidderId,
        artworkId: targetArtworkId,
        auctionId: auction._id,
        amount: auction.currentHighestBid,
        paymentStatus: 'pending',
      });
    }

    // Update artwork status to sold
    if (targetArtworkId) {
      await Artwork.findByIdAndUpdate(targetArtworkId, { status: 'sold' });
    }

    // Notify winner
    await Notification.create({
      userId: auction.highestBidderId,
      message: `🎉 Congratulations! You won the auction for "${targetTitle}" with a bid of ₹${auction.currentHighestBid.toLocaleString()}.`,
      type: 'auction_won',
      relatedId: auction._id,
    });

    // Notify artist
    if (targetArtistId) {
      await Notification.create({
        userId: targetArtistId,
        message: `🎨 Your artwork "${targetTitle}" has been sold for ₹${auction.currentHighestBid.toLocaleString()}!`,
        type: 'payment',
        relatedId: auction._id,
      });
    }

    await auction.save();
    return { auction, order };
  }

  // No bids placed — auction ended without winner
  if (targetArtworkId) {
    await Artwork.findByIdAndUpdate(targetArtworkId, { status: 'available' });
  }
  await auction.save();
  return { auction, order: null };
};

module.exports = determineWinner;
