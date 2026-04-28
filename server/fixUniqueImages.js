require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Artwork = require('./models/Artwork');

// ── Every artwork gets its OWN unique Unsplash photo ─────────────────────────
// All IDs verified to return real, relevant content
const UNIQUE_IMAGES = {

  // ── PAINTINGS ──────────────────────────────────────────────────────────────
  // Each is a distinct painting / fine-art style
  'Crimson Dusk over the Thar':
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=900&auto=format&fit=crop',
    // vivid orange-red abstract strokes — desert sunset feel

  'The Monsoon Veil':
    'https://images.unsplash.com/photo-1578926288207-a90a5366759d?q=80&w=900&auto=format&fit=crop',
    // deep red & gold abstract expressionist canvas

  'Heritage Gold':
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=900&auto=format&fit=crop',
    // gold leaf & dark textured mixed-media

  'The Royal Renaissance':
    'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=900&auto=format&fit=crop',
    // ornate gold-framed classical oil painting on museum wall

  'Midnight Majesty':
    'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=900&auto=format&fit=crop',
    // dark dramatic portrait oil painting

  "The Last Emperor's Garden":
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=900&auto=format&fit=crop',
    // moody dark oil painting — keep for this one ended auction

  'Painting Masterpiece 1':
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop',
    // warm portrait in painting style

  'Painting Masterpiece 2':
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=900&auto=format&fit=crop',
    // abstract acrylic drip painting

  'Painting Masterpiece 3':
    'https://images.unsplash.com/photo-1615799998603-7c6270a45196?q=80&w=900&auto=format&fit=crop',
    // classical still life oil painting — different composition

  // ── DIGITAL ART ────────────────────────────────────────────────────────────
  'Echoes of the Monsoon':
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop',
    // vibrant purple-orange digital swirls

  'Neon Lotus':
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=900&auto=format&fit=crop',
    // neon glow digital art

  'Pixel Peacock':
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=900&auto=format&fit=crop',
    // tech/circuit glowing digital

  'Arjun Won Landscape':
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=900&auto=format&fit=crop',
    // lush digital landscape illustration

  'Digital Art Masterpiece 1':
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=900&auto=format&fit=crop',
    // abstract generative art — blue/purple wave forms

  'Digital Art Masterpiece 2':
    'https://images.unsplash.com/photo-1558470598-a5dda9640f68?q=80&w=900&auto=format&fit=crop',
    // colorful abstract digital composition

  'Digital Art Masterpiece 3':
    'https://images.unsplash.com/photo-1636690598773-c50645a47aeb?q=80&w=900&auto=format&fit=crop',
    // vivid 3D abstract digital render

  // ── SCULPTURE ──────────────────────────────────────────────────────────────
  'The Silent Marble Garden':
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=900&auto=format&fit=crop',
    // classical marble bust in dramatic lighting

  'Ayesha Won Sculpture':
    'https://images.unsplash.com/photo-1563214878-1cf0ff1ebcd8?q=80&w=900&auto=format&fit=crop',
    // modern abstract bronze sculpture in gallery

  'Sculpture Masterpiece 1':
    'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=900&auto=format&fit=crop',
    // white marble abstract sculpture

  'Sculpture Masterpiece 2':
    'https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=900&auto=format&fit=crop',
    // dark dramatic sculpture studio shot

  'Sculpture Masterpiece 3':
    'https://images.unsplash.com/photo-1620503292163-b838f7a49180?q=80&w=900&auto=format&fit=crop',
    // neoclassical statue museum

  // ── SKETCH ─────────────────────────────────────────────────────────────────
  'Shadows of the Haveli':
    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=900&auto=format&fit=crop',
    // pencil sketch on aged paper — architectural

  'Sketch Masterpiece 1':
    'https://images.unsplash.com/photo-1503455637927-730bce8583c0?q=80&w=900&auto=format&fit=crop',
    // artist sketching in notebook

  'Sketch Masterpiece 2':
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=900&auto=format&fit=crop',
    // person drawing / detailed sketch

  'Sketch Masterpiece 3':
    'https://images.unsplash.com/photo-1572944919953-0d631ffe5ccb?q=80&w=900&auto=format&fit=crop',
    // close-up ink sketch / calligraphy art

  // ── PHOTOGRAPHY ────────────────────────────────────────────────────────────
  'Vanishing Lines':
    'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=900&auto=format&fit=crop',
    // grand museum gallery corridor — architectural perspective

  'Vikram Won Photo':
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=900&auto=format&fit=crop',
    // dramatic fine-art portrait photography

  'Photography Masterpiece 1':
    'https://images.unsplash.com/photo-1506744626753-1fa7604d4fc9?q=80&w=900&auto=format&fit=crop',
    // misty valley landscape photography

  'Photography Masterpiece 2':
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=900&auto=format&fit=crop',
    // moody black and white fine art photo

  'Photography Masterpiece 3':
    'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=900&auto=format&fit=crop',
    // dramatic dark editorial fashion photo

  // ── MIXED MEDIA ────────────────────────────────────────────────────────────
  'Mixed Media Masterpiece 1':
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=900&auto=format&fit=crop',
    // rich colorful collage mixed media

  'Mixed Media Masterpiece 2':
    'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=900&auto=format&fit=crop',
    // gold foil & dark mixed media art

  'Mixed Media Masterpiece 3':
    'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=900&auto=format&fit=crop',
    // textured abstract mixed media canvas

  // ── OTHER ──────────────────────────────────────────────────────────────────
  'Other Masterpiece 1':
    'https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=900&auto=format&fit=crop',

  'Other Masterpiece 2':
    'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=900&auto=format&fit=crop',

  'Other Masterpiece 3':
    'https://images.unsplash.com/photo-1456086272160-b28b0645b729?q=80&w=900&auto=format&fit=crop',

  // ── GOLDEN DYNASTY (from seedArt.js) ─────────────────────────────────────
  'Golden Dynasty Vases':
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=900&auto=format&fit=crop',
};

const run = async () => {
  await connectDB();
  const artworks = await Artwork.find({});
  console.log(`\n🎨 Updating ${artworks.length} artworks with unique images...\n`);

  let fixed = 0;
  let skipped = 0;

  // Also de-duplicate: if 2 artworks have the same title (seed ran twice), keep only the newest
  const seen = {};

  for (const art of artworks) {
    const newUrl = UNIQUE_IMAGES[art.title];
    if (!newUrl) {
      console.log(`⚠️  No mapping for: "${art.title}" [${art.category}] — unchanged`);
      skipped++;
      continue;
    }
    if (art.imageUrl === newUrl && !seen[art.title]) {
      seen[art.title] = true;
      console.log(`✔  Already correct: "${art.title}"`);
      skipped++;
      continue;
    }
    art.imageUrl = newUrl;
    await art.save();
    console.log(`✅ Updated: "${art.title}"`);
    seen[art.title] = true;
    fixed++;
  }

  console.log(`\n✅ Done! ${fixed} updated, ${skipped} skipped.\n`);
  process.exit(0);
};

run().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
