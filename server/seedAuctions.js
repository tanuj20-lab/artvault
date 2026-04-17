require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Artwork = require('./models/Artwork');
const Auction = require('./models/Auction');
const Bid = require('./models/Bid');
const Order = require('./models/Order');

const run = async () => {
  await connectDB();

  // ── 1. Ensure we have artists ──────────────────────────────────────────────
  let artist = await User.findOne({ role: 'artist' });
  if (!artist) {
    artist = await User.create({
      name: 'Ranveer Mehra',
      email: 'ranveer@artvault.in',
      password: 'password123',
      role: 'artist',
    });
  }

  let artist2 = await User.findOne({ email: 'priya@artvault.in' });
  if (!artist2) {
    artist2 = await User.create({
      name: 'Priya Kapoor',
      email: 'priya@artvault.in',
      password: 'password123',
      role: 'artist',
    });
  }

  // ── 2. Ensure we have buyers ───────────────────────────────────────────────
  const buyerData = [
    { name: 'Arjun Sharma',   email: 'arjun@buyer.in' },
    { name: 'Neha Patel',     email: 'neha@buyer.in'  },
    { name: 'Vikram Singh',   email: 'vikram@buyer.in'},
    { name: 'Ayesha Khan',    email: 'ayesha@buyer.in'},
  ];
  const buyers = [];
  for (const b of buyerData) {
    let buyer = await User.findOne({ email: b.email });
    if (!buyer) {
      buyer = await User.create({ ...b, password: 'password123', role: 'buyer' });
    }
    buyers.push(buyer);
  }

  // ── 3. Create two artworks for LIVE auctions ───────────────────────────────
  const artworkA = await Artwork.create({
    artistId: artist._id,
    title: 'Crimson Dusk over the Thar',
    description: 'A sweeping oil painting capturing the last embers of sunset over the Rajasthan desert. The layered warm tones evoke the feeling of standing in an endless golden silence.',
    category: 'Painting',
    medium: 'Oil on Canvas',
    dimensions: '48x36 inches',
    basePrice: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c03fa75?q=80&w=1200',
    status: 'auction',
    isFeatured: true,
  });

  const artworkB = await Artwork.create({
    artistId: artist2._id,
    title: 'Echoes of the Monsoon',
    description: 'A digital art masterpiece that merges traditional Indian motifs with hyperrealistic rain textures. Shot during the peak of Monsoon 2023 in the hills of Coorg.',
    category: 'Digital Art',
    medium: 'Digital Mixed Media',
    dimensions: '4K Canvas Print – 40x30 inches',
    basePrice: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
    status: 'auction',
    isFeatured: true,
  });

  // ── 4. Create LIVE auctions (ends 2 days from now) ────────────────────────
  const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const auctionA = await Auction.create({
    artworkId: artworkA._id,
    artistId: artist._id,
    startingBid: 85000,
    currentHighestBid: 142000,
    highestBidderId: buyers[0]._id,
    auctionEndDate: twoDaysFromNow,
    status: 'active',
  });

  const auctionB = await Auction.create({
    artworkId: artworkB._id,
    artistId: artist2._id,
    startingBid: 120000,
    currentHighestBid: 198000,
    highestBidderId: buyers[2]._id,
    auctionEndDate: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000),
    status: 'active',
  });

  // ── 5. Seed realistic bid history for Auction A ───────────────────────────
  const bidsA = [
    { buyerId: buyers[1]._id, bidAmount: 90000,  createdAt: new Date(Date.now() - 28 * 3600000) },
    { buyerId: buyers[3]._id, bidAmount: 102000, createdAt: new Date(Date.now() - 22 * 3600000) },
    { buyerId: buyers[0]._id, bidAmount: 118000, createdAt: new Date(Date.now() - 15 * 3600000) },
    { buyerId: buyers[3]._id, bidAmount: 128000, createdAt: new Date(Date.now() - 10 * 3600000) },
    { buyerId: buyers[1]._id, bidAmount: 135000, createdAt: new Date(Date.now() -  6 * 3600000) },
    { buyerId: buyers[0]._id, bidAmount: 142000, createdAt: new Date(Date.now() -  2 * 3600000) },
  ];
  for (const b of bidsA) {
    await Bid.create({ auctionId: auctionA._id, ...b });
  }

  // ── 6. Seed realistic bid history for Auction B ───────────────────────────
  const bidsB = [
    { buyerId: buyers[0]._id, bidAmount: 125000, createdAt: new Date(Date.now() - 30 * 3600000) },
    { buyerId: buyers[2]._id, bidAmount: 140000, createdAt: new Date(Date.now() - 20 * 3600000) },
    { buyerId: buyers[3]._id, bidAmount: 158000, createdAt: new Date(Date.now() - 12 * 3600000) },
    { buyerId: buyers[0]._id, bidAmount: 172000, createdAt: new Date(Date.now() -  8 * 3600000) },
    { buyerId: buyers[2]._id, bidAmount: 185000, createdAt: new Date(Date.now() -  4 * 3600000) },
    { buyerId: buyers[2]._id, bidAmount: 198000, createdAt: new Date(Date.now() -  1 * 3600000) },
  ];
  for (const b of bidsB) {
    await Bid.create({ auctionId: auctionB._id, ...b });
  }

  // ── 7. Create an ENDED auction with PAID order (payment proof demo) ───────
  const artworkC = await Artwork.create({
    artistId: artist._id,
    title: 'The Last Emperor\'s Garden',
    description: 'A meticulously crafted Chinese ink-wash painting depicting an imagined garden of the last Emperor. Exhibited at the Mumbai Art Fair 2024.',
    category: 'Painting',
    medium: 'Chinese Ink on Silk',
    dimensions: '36x24 inches',
    basePrice: 200000,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200',
    status: 'sold',
  });

  const auctionC = await Auction.create({
    artworkId: artworkC._id,
    artistId: artist._id,
    startingBid: 200000,
    currentHighestBid: 387000,
    highestBidderId: buyers[1]._id,
    auctionEndDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // ended 3 days ago
    status: 'ended',
    winnerId: buyers[1]._id,
  });

  // Bids for ended auction
  const bidsC = [
    { buyerId: buyers[0]._id, bidAmount: 210000, createdAt: new Date(Date.now() - 7 * 24 * 3600000) },
    { buyerId: buyers[2]._id, bidAmount: 250000, createdAt: new Date(Date.now() - 6 * 24 * 3600000) },
    { buyerId: buyers[1]._id, bidAmount: 295000, createdAt: new Date(Date.now() - 5 * 24 * 3600000) },
    { buyerId: buyers[3]._id, bidAmount: 340000, createdAt: new Date(Date.now() - 4 * 24 * 3600000) },
    { buyerId: buyers[1]._id, bidAmount: 387000, createdAt: new Date(Date.now() - 4 * 24 * 3600000 + 3600000) },
  ];
  for (const b of bidsC) {
    await Bid.create({ auctionId: auctionC._id, ...b });
  }

  // Paid order for the ended auction
  const paymentDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  await Order.create({
    buyerId: buyers[1]._id,
    artworkId: artworkC._id,
    auctionId: auctionC._id,
    amount: 387000,
    paymentStatus: 'paid',
    deliveryStatus: 'shipped',
    paymentTransactionId: 'TXN' + (paymentDate.getTime()) + 'A3F8B2',
    paymentDate: paymentDate,
    paymentMethod: 'UPI / Online Transfer',
    shippingAddress: '42, Gulmohar Lane, Bandra West, Mumbai – 400050',
  });

  console.log('✅ Seeded 2 live auctions with bid history + 1 ended paid auction!');
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
