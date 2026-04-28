require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Artwork = require('./models/Artwork');
const Auction = require('./models/Auction');
const Bid = require('./models/Bid');
const Order = require('./models/Order');

// ── Verified Unsplash image pools by category ─────────────────────────────
const IMGS = {
  Painting: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578926288207-a90a5366759d?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=900&auto=format&fit=crop',
  ],
  Sculpture: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563214878-1cf0ff1ebcd8?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=900&auto=format&fit=crop',
  ],
  Photography: [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506744626753-1fa7604d4fc9?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=900&auto=format&fit=crop',
  ],
  'Digital Art': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=900&auto=format&fit=crop',
  ],
  Sketch: [
    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503455637927-730bce8583c0?q=80&w=900&auto=format&fit=crop',
  ],
  'Mixed Media': [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=900&auto=format&fit=crop',
  ],
};

const img = (cat, i = 0) => IMGS[cat][i % IMGS[cat].length];

const run = async () => {
  await connectDB();
  console.log('\n🌱 Starting full data seed for all logins...\n');

  // ── Ensure Admin ──────────────────────────────────────────────────────────
  let admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: 'admin@artvault.in',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin created: admin@artvault.in / admin123');
  } else {
    console.log(`✅ Admin exists: ${admin.email}`);
  }

  // ── Ensure Artists ────────────────────────────────────────────────────────
  const artistsData = [
    { name: 'Ranveer Mehra',  email: 'ranveer@artvault.in'       },
    { name: 'Priya Kapoor',   email: 'priya@artvault.in'         },
    { name: 'Arjun Nair',     email: 'arjun.artist@artvault.in'  },
  ];
  const artists = [];
  for (const a of artistsData) {
    let u = await User.findOne({ email: a.email });
    if (!u) u = await User.create({ ...a, password: 'password123', role: 'artist' });
    artists.push(u);
    console.log(`✅ Artist: ${a.email}`);
  }

  // ── Ensure Buyers ─────────────────────────────────────────────────────────
  const buyersData = [
    { name: 'Arjun Sharma',  email: 'arjun@buyer.in'   },
    { name: 'Neha Patel',    email: 'neha@buyer.in'    },
    { name: 'Vikram Singh',  email: 'vikram@buyer.in'  },
    { name: 'Ayesha Khan',   email: 'ayesha@buyer.in'  },
  ];
  const buyers = [];
  for (const b of buyersData) {
    let u = await User.findOne({ email: b.email });
    if (!u) u = await User.create({ ...b, password: 'password123', role: 'buyer' });
    buyers.push(u);
    console.log(`✅ Buyer: ${b.email}`);
  }

  console.log('\n🎨 Seeding artworks for each artist...\n');

  // ── Artist 0: Ranveer Mehra — Paintings ──────────────────────────────────
  const ranveerArts = [
    {
      title: 'Crimson Dusk over the Thar',
      description: 'Sweeping oil painting capturing the last embers of sunset over the Rajasthan desert. Warm layered tones evoke golden silence.',
      category: 'Painting', medium: 'Oil on Canvas', dimensions: '48×36 inches', basePrice: 85000,
      imageUrl: img('Painting', 0), status: 'auction', isFeatured: true,
    },
    {
      title: 'The Monsoon Veil',
      description: 'A watercolour study of rain-draped mountains dissolving into mist. Soft blues and greys blend into an ethereal landscape.',
      category: 'Painting', medium: 'Watercolour', dimensions: '24×18 inches', basePrice: 42000,
      imageUrl: img('Painting', 1), status: 'available', isFeatured: false,
    },
    {
      title: 'Heritage Gold',
      description: 'Bold acrylic strokes reference Mughal miniature art — intricate patterns rendered at monumental scale with burnished gold leaf.',
      category: 'Painting', medium: 'Acrylic & Gold Leaf', dimensions: '36×36 inches', basePrice: 65000,
      imageUrl: img('Painting', 2), status: 'available', isFeatured: true,
    },
  ];

  // ── Artist 1: Priya Kapoor — Digital Art ─────────────────────────────────
  const priyaArts = [
    {
      title: 'Echoes of the Monsoon',
      description: 'Digital art masterpiece merging traditional Indian motifs with hyperrealistic rain textures. Created during Monsoon 2023 in Coorg.',
      category: 'Digital Art', medium: 'Digital Mixed Media', dimensions: '4K Canvas Print – 40×30 inches', basePrice: 120000,
      imageUrl: img('Digital Art', 0), status: 'auction', isFeatured: true,
    },
    {
      title: 'Neon Lotus',
      description: 'A vibrant cyberpunk reimagining of the sacred lotus — electric blues and magentas bloom against a dark circuit-board landscape.',
      category: 'Digital Art', medium: 'Digital Illustration', dimensions: '30×30 inches', basePrice: 38000,
      imageUrl: img('Digital Art', 1), status: 'available', isFeatured: false,
    },
    {
      title: 'Pixel Peacock',
      description: 'Traditional Indian peacock motif deconstructed into a glitching pixel tapestry. Where classical art meets glitch art.',
      category: 'Digital Art', medium: 'Generative Digital Art', dimensions: '24×36 inches', basePrice: 55000,
      imageUrl: img('Digital Art', 2), status: 'available', isFeatured: true,
    },
  ];

  // ── Artist 2: Arjun Nair — Mixed (Sketch + Photography) ──────────────────
  const arjunArts = [
    {
      title: 'The Silent Marble Garden',
      description: 'Hyperrealistic charcoal study of neoclassical marble gardens. Cold grandeur and ethereal stillness captured on black paper.',
      category: 'Sketch', medium: 'Charcoal & Chalk on Black Paper', dimensions: '30×22 inches', basePrice: 55000,
      imageUrl: img('Sketch', 0), status: 'auction', isFeatured: true,
    },
    {
      title: 'Shadows of the Haveli',
      description: 'Ink wash study of light and shadow through the carved stone windows of a Rajasthani haveli. Meditative and quiet.',
      category: 'Sketch', medium: 'Ink Wash on Paper', dimensions: '18×24 inches', basePrice: 22000,
      imageUrl: img('Sketch', 1), status: 'available', isFeatured: false,
    },
    {
      title: 'Vanishing Lines',
      description: 'Geometric charcoal composition exploring forced perspective inside a century-old library corridor. Architectural and dreamlike.',
      category: 'Photography', medium: 'Fine Art Photography Print', dimensions: '20×30 inches', basePrice: 18000,
      imageUrl: img('Photography', 2), status: 'available', isFeatured: false,
    },
  ];

  const allArtData = [
    { artist: artists[0], arts: ranveerArts },
    { artist: artists[1], arts: priyaArts  },
    { artist: artists[2], arts: arjunArts  },
  ];

  // Upsert artworks (don't duplicate if already seeded by title)
  const artworkMap = {}; // title → artwork doc
  for (const { artist, arts } of allArtData) {
    for (const artDef of arts) {
      let existing = await Artwork.findOne({ title: artDef.title });
      if (!existing) {
        existing = await Artwork.create({ ...artDef, artistId: artist._id });
        console.log(`  🖼️  Created: "${artDef.title}"`);
      } else {
        // Update image just in case
        existing.imageUrl = artDef.imageUrl;
        existing.status = artDef.status;
        await existing.save();
        console.log(`  ✔️  Exists:  "${artDef.title}"`);
      }
      artworkMap[artDef.title] = existing;
    }
  }

  console.log('\n🔨 Setting up auctions...\n');

  // Clean existing auctions/bids/orders to rebuild cleanly
  await Bid.deleteMany({});
  await Order.deleteMany({});
  await Auction.deleteMany({});

  const days = (n) => new Date(Date.now() + n * 86400000);

  // ── 3 LIVE Auctions ───────────────────────────────────────────────────────
  const auctionA = await Auction.create({
    artworkId: artworkMap['Crimson Dusk over the Thar']._id,
    artistId:  artists[0]._id,
    startingBid: 85000, currentHighestBid: 142000,
    highestBidderId: buyers[0]._id,
    auctionEndDate: days(7), status: 'active',
  });
  await Artwork.findByIdAndUpdate(artworkMap['Crimson Dusk over the Thar']._id, { status: 'auction' });

  const auctionB = await Auction.create({
    artworkId: artworkMap['Echoes of the Monsoon']._id,
    artistId:  artists[1]._id,
    startingBid: 120000, currentHighestBid: 198000,
    highestBidderId: buyers[2]._id,
    auctionEndDate: days(5), status: 'active',
  });
  await Artwork.findByIdAndUpdate(artworkMap['Echoes of the Monsoon']._id, { status: 'auction' });

  const auctionC = await Auction.create({
    artworkId: artworkMap['The Silent Marble Garden']._id,
    artistId:  artists[2]._id,
    startingBid: 55000, currentHighestBid: 87500,
    highestBidderId: buyers[1]._id,
    auctionEndDate: days(3), status: 'active',
  });
  await Artwork.findByIdAndUpdate(artworkMap['The Silent Marble Garden']._id, { status: 'auction' });

  console.log('✅ 3 live auctions created');

  // ── Ended auction for Neha → paid order ──────────────────────────────────
  // Create a dedicated sold artwork for Neha's ended auction
  let soldArt = await Artwork.findOne({ title: "The Last Emperor's Garden" });
  if (!soldArt) {
    soldArt = await Artwork.create({
      artistId: artists[0]._id,
      title: "The Last Emperor's Garden",
      description: 'Meticulously crafted oil painting of the imagined garden of the last Emperor. Exhibited at Mumbai Art Fair 2024.',
      category: 'Painting', medium: 'Oil on Canvas', dimensions: '36×24 inches', basePrice: 200000,
      imageUrl: img('Painting', 0), status: 'sold',
    });
  } else {
    soldArt.status = 'sold';
    await soldArt.save();
  }

  const auctionD = await Auction.create({
    artworkId: soldArt._id, artistId: artists[0]._id,
    startingBid: 200000, currentHighestBid: 387000,
    highestBidderId: buyers[1]._id,
    auctionEndDate: days(-3), status: 'ended', winnerId: buyers[1]._id,
  });

  // ── Bid histories ─────────────────────────────────────────────────────────
  // Auction A — arjun leads, all 4 buyers participate
  const bidDataA = [
    { buyerId: buyers[1]._id, bidAmount: 90000,  hrs: 28 },
    { buyerId: buyers[3]._id, bidAmount: 102000, hrs: 22 },
    { buyerId: buyers[0]._id, bidAmount: 118000, hrs: 15 },
    { buyerId: buyers[3]._id, bidAmount: 128000, hrs: 10 },
    { buyerId: buyers[1]._id, bidAmount: 135000, hrs: 6  },
    { buyerId: buyers[0]._id, bidAmount: 142000, hrs: 2  },  // arjun leads
  ];
  for (const b of bidDataA) {
    await Bid.create({ auctionId: auctionA._id, buyerId: b.buyerId, bidAmount: b.bidAmount,
      createdAt: new Date(Date.now() - b.hrs * 3600000) });
  }

  // Auction B — vikram leads, all 4 buyers participate
  const bidDataB = [
    { buyerId: buyers[0]._id, bidAmount: 125000, hrs: 30 },
    { buyerId: buyers[2]._id, bidAmount: 140000, hrs: 20 },
    { buyerId: buyers[3]._id, bidAmount: 158000, hrs: 12 },
    { buyerId: buyers[0]._id, bidAmount: 172000, hrs: 8  },
    { buyerId: buyers[1]._id, bidAmount: 185000, hrs: 4  },
    { buyerId: buyers[2]._id, bidAmount: 198000, hrs: 1  },  // vikram leads
  ];
  for (const b of bidDataB) {
    await Bid.create({ auctionId: auctionB._id, buyerId: b.buyerId, bidAmount: b.bidAmount,
      createdAt: new Date(Date.now() - b.hrs * 3600000) });
  }

  // Auction C — neha leads, all 4 buyers participate
  const bidDataC = [
    { buyerId: buyers[3]._id, bidAmount: 58000, hrs: 18 },
    { buyerId: buyers[0]._id, bidAmount: 65000, hrs: 14 },
    { buyerId: buyers[2]._id, bidAmount: 74000, hrs: 10 },  // vikram also bids here
    { buyerId: buyers[3]._id, bidAmount: 79500, hrs: 5  },
    { buyerId: buyers[1]._id, bidAmount: 87500, hrs: 1  },  // neha leads
  ];
  for (const b of bidDataC) {
    await Bid.create({ auctionId: auctionC._id, buyerId: b.buyerId, bidAmount: b.bidAmount,
      createdAt: new Date(Date.now() - b.hrs * 3600000) });
  }

  // Ended auction D bids
  const bidDataD = [
    { buyerId: buyers[0]._id, bidAmount: 210000, days: 7 },
    { buyerId: buyers[2]._id, bidAmount: 250000, days: 6 },
    { buyerId: buyers[1]._id, bidAmount: 295000, days: 5 },
    { buyerId: buyers[3]._id, bidAmount: 340000, days: 4 },
    { buyerId: buyers[1]._id, bidAmount: 387000, days: 4 },  // neha won
  ];
  for (const b of bidDataD) {
    await Bid.create({ auctionId: auctionD._id, buyerId: b.buyerId, bidAmount: b.bidAmount,
      createdAt: new Date(Date.now() - b.days * 86400000) });
  }

  console.log('✅ All bid histories created');

  // ── Orders: each buyer gets at least one ─────────────────────────────────
  console.log('\n💳 Creating orders for each buyer...\n');

  // Neha — PAID (won ended auction)
  const txnNeha = `TXN${Date.now()}N3H4P1`;
  await Order.create({
    buyerId: buyers[1]._id, artworkId: soldArt._id, auctionId: auctionD._id,
    amount: 387000, paymentStatus: 'paid', deliveryStatus: 'shipped',
    paymentTransactionId: txnNeha,
    paymentDate: new Date(Date.now() - 2 * 86400000),
    paymentMethod: 'UPI / Online Transfer',
    shippingAddress: '42, Gulmohar Lane, Bandra West, Mumbai – 400050',
  });
  console.log(`  ✅ Neha — Paid order | TXN: ${txnNeha}`);

  // Arjun — PENDING (recently won a different ended auction)
  let arjunSoldArt = await Artwork.findOne({ title: 'Arjun Won Landscape' });
  if (!arjunSoldArt) {
    arjunSoldArt = await Artwork.create({
      artistId: artists[1]._id,
      title: 'Arjun Won Landscape',
      description: 'A lush panoramic digital landscape won by Arjun in auction. Vivid hills at golden hour.',
      category: 'Digital Art', medium: 'Digital Illustration', dimensions: '40×24 inches',
      basePrice: 48000, imageUrl: img('Digital Art', 1), status: 'sold',
    });
  } else { arjunSoldArt.status = 'sold'; await arjunSoldArt.save(); }

  const arjunEndedAuction = await Auction.create({
    artworkId: arjunSoldArt._id, artistId: artists[1]._id,
    startingBid: 48000, currentHighestBid: 73000,
    highestBidderId: buyers[0]._id,
    auctionEndDate: days(-1), status: 'ended', winnerId: buyers[0]._id,
  });
  await Bid.create({ auctionId: arjunEndedAuction._id, buyerId: buyers[0]._id, bidAmount: 73000,
    createdAt: new Date(Date.now() - 86400000 * 2) });

  await Order.create({
    buyerId: buyers[0]._id, artworkId: arjunSoldArt._id, auctionId: arjunEndedAuction._id,
    amount: 73000, paymentStatus: 'pending', deliveryStatus: 'processing',
    shippingAddress: '',
  });
  console.log('  ✅ Arjun — Pending payment order');

  // Vikram — PAID order (a photography artwork)
  let vikramSoldArt = await Artwork.findOne({ title: 'Vikram Won Photo' });
  if (!vikramSoldArt) {
    vikramSoldArt = await Artwork.create({
      artistId: artists[2]._id,
      title: 'Vikram Won Photo',
      description: 'Dramatic fine-art landscape photography — misty valley at dawn, captured in the Western Ghats.',
      category: 'Photography', medium: 'Fine Art Photography Print', dimensions: '30×20 inches',
      basePrice: 25000, imageUrl: img('Photography', 0), status: 'sold',
    });
  } else { vikramSoldArt.status = 'sold'; await vikramSoldArt.save(); }

  const vikramEndedAuction = await Auction.create({
    artworkId: vikramSoldArt._id, artistId: artists[2]._id,
    startingBid: 25000, currentHighestBid: 41000,
    highestBidderId: buyers[2]._id,
    auctionEndDate: days(-5), status: 'ended', winnerId: buyers[2]._id,
  });
  await Bid.create({ auctionId: vikramEndedAuction._id, buyerId: buyers[2]._id, bidAmount: 41000,
    createdAt: new Date(Date.now() - 86400000 * 6) });

  const txnVikram = `TXN${Date.now() + 1}V1KR4M`;
  await Order.create({
    buyerId: buyers[2]._id, artworkId: vikramSoldArt._id, auctionId: vikramEndedAuction._id,
    amount: 41000, paymentStatus: 'paid', deliveryStatus: 'delivered',
    paymentTransactionId: txnVikram,
    paymentDate: new Date(Date.now() - 4 * 86400000),
    paymentMethod: 'Credit Card / Net Banking',
    shippingAddress: '18, Residency Road, Indiranagar, Bangalore – 560025',
  });
  console.log(`  ✅ Vikram — Paid order | TXN: ${txnVikram}`);

  // Ayesha — PENDING order
  let ayeshaSoldArt = await Artwork.findOne({ title: 'Ayesha Won Sculpture' });
  if (!ayeshaSoldArt) {
    ayeshaSoldArt = await Artwork.create({
      artistId: artists[0]._id,
      title: 'Ayesha Won Sculpture',
      description: 'Elegant abstract bronze sculpture — sinuous forms inspired by classical Indian dance movements.',
      category: 'Sculpture', medium: 'Bronze Cast', dimensions: '18 inches height',
      basePrice: 95000, imageUrl: img('Sculpture', 1), status: 'sold',
    });
  } else { ayeshaSoldArt.status = 'sold'; await ayeshaSoldArt.save(); }

  const ayeshaEndedAuction = await Auction.create({
    artworkId: ayeshaSoldArt._id, artistId: artists[0]._id,
    startingBid: 95000, currentHighestBid: 132000,
    highestBidderId: buyers[3]._id,
    auctionEndDate: days(-2), status: 'ended', winnerId: buyers[3]._id,
  });
  await Bid.create({ auctionId: ayeshaEndedAuction._id, buyerId: buyers[3]._id, bidAmount: 132000,
    createdAt: new Date(Date.now() - 86400000 * 3) });

  await Order.create({
    buyerId: buyers[3]._id, artworkId: ayeshaSoldArt._id, auctionId: ayeshaEndedAuction._id,
    amount: 132000, paymentStatus: 'pending', deliveryStatus: 'processing',
    shippingAddress: '',
  });
  console.log('  ✅ Ayesha — Pending payment order');

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════════════');
  console.log('✅ COMPLETE SEED DONE!');
  console.log('════════════════════════════════════════════════\n');

  console.log('👑 ADMIN:');
  console.log('   admin@artvault.in     / admin123\n');

  console.log('🎨 ARTISTS (all have 3 artworks + 1 live auction):');
  console.log('   ranveer@artvault.in        / password123');
  console.log('   priya@artvault.in          / password123');
  console.log('   arjun.artist@artvault.in   / password123\n');

  console.log('🛍️  BUYERS (all have bids + at least 1 order):');
  console.log('   arjun@buyer.in    / password123  → ⏳ Pending payment ₹73,000');
  console.log('   neha@buyer.in     / password123  → ✅ Paid ₹3,87,000 | shipped');
  console.log('   vikram@buyer.in   / password123  → ✅ Paid ₹41,000 | delivered');
  console.log('   ayesha@buyer.in   / password123  → ⏳ Pending payment ₹1,32,000');
  console.log('');
  console.log('🔴 LIVE AUCTIONS (3 active):');
  console.log('   Crimson Dusk over the Thar   — ends in 7 days');
  console.log('   Echoes of the Monsoon        — ends in 5 days');
  console.log('   The Silent Marble Garden     — ends in 3 days\n');

  process.exit(0);
};

run().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
