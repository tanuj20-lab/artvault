require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Artwork = require('./models/Artwork');
const Auction = require('./models/Auction');
const Bid = require('./models/Bid');
const Order = require('./models/Order');

// All unique images — one per artwork title
const UNIQUE_IMAGES = {
  'Crimson Dusk over the Thar':
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=900&auto=format&fit=crop',
  'The Monsoon Veil':
    'https://images.unsplash.com/photo-1578926288207-a90a5366759d?q=80&w=900&auto=format&fit=crop',
  'Heritage Gold':
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=900&auto=format&fit=crop',
  'The Royal Renaissance':
    'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=900&auto=format&fit=crop',
  'Midnight Majesty':
    'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=900&auto=format&fit=crop',
  "The Last Emperor's Garden":
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=900&auto=format&fit=crop',
  'Painting Masterpiece 1':
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop',
  'Painting Masterpiece 2':
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900&auto=format&fit=crop',
  'Painting Masterpiece 3':
    'https://images.unsplash.com/photo-1615799998603-7c6270a45196?q=80&w=900&auto=format&fit=crop',
  'Echoes of the Monsoon':
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop',
  'Neon Lotus':
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=900&auto=format&fit=crop',
  'Pixel Peacock':
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=900&auto=format&fit=crop',
  'Arjun Won Landscape':
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=900&auto=format&fit=crop',
  'Digital Art Masterpiece 1':
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=900&auto=format&fit=crop',
  'Digital Art Masterpiece 2':
    'https://images.unsplash.com/photo-1558470598-a5dda9640f68?q=80&w=900&auto=format&fit=crop',
  'Digital Art Masterpiece 3':
    'https://images.unsplash.com/photo-1636690598773-c50645a47aeb?q=80&w=900&auto=format&fit=crop',
  'The Silent Marble Garden':
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop',
  'Ayesha Won Sculpture':
    'https://images.unsplash.com/photo-1563214878-1cf0ff1ebcd8?q=80&w=900&auto=format&fit=crop',
  'Sculpture Masterpiece 1':
    'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=900&auto=format&fit=crop',
  'Sculpture Masterpiece 2':
    'https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=900&auto=format&fit=crop',
  'Sculpture Masterpiece 3':
    'https://images.unsplash.com/photo-1620503292163-b838f7a49180?q=80&w=900&auto=format&fit=crop',
  'Shadows of the Haveli':
    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=900&auto=format&fit=crop',
  'Sketch Masterpiece 1':
    'https://images.unsplash.com/photo-1503455637927-730bce8583c0?q=80&w=900&auto=format&fit=crop',
  'Sketch Masterpiece 2':
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=900&auto=format&fit=crop',
  'Sketch Masterpiece 3':
    'https://images.unsplash.com/photo-1572944919953-0d631ffe5ccb?q=80&w=900&auto=format&fit=crop',
  'Vanishing Lines':
    'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=900&auto=format&fit=crop',
  'Vikram Won Photo':
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=900&auto=format&fit=crop',
  'Photography Masterpiece 1':
    'https://images.unsplash.com/photo-1506744626753-1fa7604d4fc9?q=80&w=900&auto=format&fit=crop',
  'Photography Masterpiece 2':
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=900&auto=format&fit=crop',
  'Photography Masterpiece 3':
    'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=900&auto=format&fit=crop',
  'Mixed Media Masterpiece 1':
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=900&auto=format&fit=crop',
  'Mixed Media Masterpiece 2':
    'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=900&auto=format&fit=crop',
  'Mixed Media Masterpiece 3':
    'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=900&auto=format&fit=crop',
  'Other Masterpiece 1':
    'https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=900&auto=format&fit=crop',
  'Other Masterpiece 2':
    'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=900&auto=format&fit=crop',
  'Other Masterpiece 3':
    'https://images.unsplash.com/photo-1456086272160-b28b0645b729?q=80&w=900&auto=format&fit=crop',
  'Golden Dynasty Vases':
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=900&auto=format&fit=crop',
};

const run = async () => {
  await connectDB();

  // ── Step 1: Find all duplicate titles ─────────────────────────────────────
  const all = await Artwork.find({}).sort({ createdAt: 1 }); // oldest first
  console.log(`\n🔍 Total artworks in DB: ${all.length}`);

  const byTitle = {};
  for (const art of all) {
    if (!byTitle[art.title]) byTitle[art.title] = [];
    byTitle[art.title].push(art);
  }

  const duplicateTitles = Object.keys(byTitle).filter(t => byTitle[t].length > 1);
  console.log(`⚠️  ${duplicateTitles.length} titles have duplicates:`);
  duplicateTitles.forEach(t => console.log(`   "${t}" × ${byTitle[t].length}`));

  // ── Step 2: For each duplicate title, keep ONLY the one used in an auction,
  //    else keep the oldest, and delete the rest ────────────────────────────
  const activeAuctions = await Auction.find({ status: 'active' });
  const activeArtworkIds = new Set(activeAuctions.map(a => a.artworkId.toString()));

  let deletedCount = 0;
  const keptIds = new Set();

  for (const title of duplicateTitles) {
    const entries = byTitle[title];

    // Prefer the one referenced by an active auction
    let keeper = entries.find(e => activeArtworkIds.has(e._id.toString()));
    if (!keeper) {
      // Prefer the one referenced by any auction
      const allAuctions = await Auction.find({ artworkId: { $in: entries.map(e => e._id) } });
      if (allAuctions.length > 0) {
        const referencedId = allAuctions[0].artworkId.toString();
        keeper = entries.find(e => e._id.toString() === referencedId) || entries[entries.length - 1];
      } else {
        keeper = entries[entries.length - 1]; // keep newest
      }
    }

    keptIds.add(keeper._id.toString());
    const toDelete = entries.filter(e => e._id.toString() !== keeper._id.toString());

    for (const dup of toDelete) {
      // Reassign any orders/auctions/bids pointing to this dup to the keeper
      await Auction.updateMany({ artworkId: dup._id }, { artworkId: keeper._id });
      await Order.updateMany({ artworkId: dup._id }, { artworkId: keeper._id });
      await dup.deleteOne();
      console.log(`🗑  Deleted duplicate: "${title}" (${dup._id})`);
      deletedCount++;
    }
  }

  // ── Step 3: Assign unique images to all remaining artworks ────────────────
  const remaining = await Artwork.find({});
  console.log(`\n🎨 Assigning unique images to ${remaining.length} artworks...`);

  for (const art of remaining) {
    const newUrl = UNIQUE_IMAGES[art.title];
    if (newUrl && art.imageUrl !== newUrl) {
      art.imageUrl = newUrl;
      await art.save();
      console.log(`  ✅ ${art.title}`);
    }
  }

  console.log(`\n════════════════════════════════════════`);
  console.log(`✅ Done! Deleted ${deletedCount} duplicates.`);
  console.log(`   Remaining artworks: ${remaining.length}`);
  console.log(`════════════════════════════════════════\n`);
  process.exit(0);
};

run().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
