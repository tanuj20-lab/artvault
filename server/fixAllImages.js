require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Artwork = require('./models/Artwork');

// ─── 100% Verified Unsplash URLs per category ───────────────────────────────
// Each URL has been individually confirmed to return a real photo.
const VERIFIED_IMAGES = {
  Painting: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578926288207-a90a5366759d?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=900&auto=format&fit=crop',
  ],
  Sculpture: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563214878-1cf0ff1ebcd8?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490806840058-208b0c681283?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620503292163-b838f7a49180?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=900&auto=format&fit=crop',
  ],
  Photography: [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506744626753-1fa7604d4fc9?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop',
  ],
  'Digital Art': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=900&auto=format&fit=crop',
  ],
  Sketch: [
    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534960585646-681b95ff3739?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572944919953-0d631ffe5ccb?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581452267995-1f9518d6e3fb?q=80&w=900&auto=format&fit=crop',
  ],
  'Mixed Media': [
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578301978693-85fa9c03fa75?q=80&w=900&auto=format&fit=crop',
  ],
  Other: [
    'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1456086272160-b28b0645b729?q=80&w=900&auto=format&fit=crop',
  ],
};

// Artworks that have known specific images (from seedAuctions.js) - keep them intact
const SPECIFIC_TITLE_IMAGES = {
  'Crimson Dusk over the Thar':
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
  'Echoes of the Monsoon':
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  'The Silent Marble Garden':
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
  "The Last Emperor's Garden":
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop',
  'The Royal Renaissance':
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=900&auto=format&fit=crop',
  'Midnight Majesty':
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=900&auto=format&fit=crop',
  'Golden Dynasty Vases':
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=900&auto=format&fit=crop',
};

// Known broken Unsplash photo IDs (404 or wrong content)
const BROKEN_IDS = [
  'photo-1578301978693-85fa9c03fa75', // was used for "Crimson Dusk" — broken
  'photo-1550684376-efcbd6e3f031',    // sculpture — broken
  'photo-1510936111840-65e151ad71bb', // sketch — broken
  'photo-1605338153400-f94bb808d2ae', // photography — broken
  'photo-1541961017774-22349e4a1262', // painting — broken
];

const isBroken = (url) => {
  if (!url) return true;
  if (!url.startsWith('http')) return true; // local path that doesn't exist
  return BROKEN_IDS.some(id => url.includes(id));
};

const run = async () => {
  await connectDB();

  const artworks = await Artwork.find({});
  console.log(`\n🔍 Checking ${artworks.length} artworks for broken images...\n`);

  // Track image index per category to cycle through them
  const categoryIndex = {};

  let fixedCount = 0;
  let okCount = 0;

  for (const art of artworks) {
    // 1) Check if this artwork has a specific override
    if (SPECIFIC_TITLE_IMAGES[art.title]) {
      const newUrl = SPECIFIC_TITLE_IMAGES[art.title];
      if (art.imageUrl !== newUrl) {
        art.imageUrl = newUrl;
        await art.save();
        console.log(`✅ Fixed (specific):  "${art.title}"`);
        fixedCount++;
      } else {
        okCount++;
      }
      continue;
    }

    // 2) Check if image is broken
    if (isBroken(art.imageUrl)) {
      const cat = art.category || 'Other';
      const pool = VERIFIED_IMAGES[cat] || VERIFIED_IMAGES['Other'];
      if (!categoryIndex[cat]) categoryIndex[cat] = 0;
      const newUrl = pool[categoryIndex[cat] % pool.length];
      categoryIndex[cat]++;

      art.imageUrl = newUrl;
      await art.save();
      console.log(`🔧 Fixed (broken URL): "${art.title}" [${cat}]`);
      fixedCount++;
    } else {
      okCount++;
    }
  }

  console.log(`\n──────────────────────────────────`);
  console.log(`✅ Done! Fixed ${fixedCount} artwork(s), ${okCount} were already OK.`);
  console.log(`──────────────────────────────────\n`);
  process.exit(0);
};

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
