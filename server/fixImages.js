require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Artwork = require('./models/Artwork');

// Curated high-quality art images for specific artworks
const specificFixes = {
  'Crimson Dusk over the Thar': 'https://images.unsplash.com/photo-1578301978693-85fa9c03fa75?q=80&w=1200',
  'The Last Emperor\'s Garden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Blumenstraus_01_KMSp7.jpg/800px-Blumenstraus_01_KMSp7.jpg',
  'Echoes of the Monsoon': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
};

// Category-specific art images (cycle through them per category)
const categoryImages = {
  'Painting': [
    'https://images.unsplash.com/photo-1578301978693-85fa9c03fa75?q=80&w=1200',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200',
    'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=1200',
    'https://images.unsplash.com/photo-1589568561816-7289c32d9c1d?q=80&w=1200',
    'https://images.unsplash.com/photo-1635353466548-2a7cc2abaf5f?q=80&w=1200',
  ],
  'Sculpture': [
    'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=1200',
    'https://images.unsplash.com/photo-1490806840058-208b0c681283?q=80&w=1200',
    'https://images.unsplash.com/photo-1563214878-1cf0ff1ebcd8?q=80&w=1200',
    'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=1200',
  ],
  'Photography': [
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200',
    'https://images.unsplash.com/photo-1506744626753-1fa7604d4fc9?q=80&w=1200',
    'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1200',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
  ],
  'Digital Art': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200',
    'https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=80&w=1200',
    'https://images.unsplash.com/photo-1614728263952-84ea256f9d4d?q=80&w=1200',
  ],
  'Sketch': [
    'https://images.unsplash.com/photo-1510936111840-65e151ad71bb?q=80&w=1200',
    'https://images.unsplash.com/photo-1581452267995-1f9518d6e3fb?q=80&w=1200',
    'https://images.unsplash.com/photo-1534960585646-681b95ff3739?q=80&w=1200',
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=1200',
  ],
  'Mixed Media': [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1200',
    'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=1200',
    'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1200',
  ],
  'Other': [
    'https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1200',
    'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=1200',
    'https://images.unsplash.com/photo-1456086272160-b28b0645b729?q=80&w=1200',
    'https://images.unsplash.com/photo-1504713152858-7e7c38d9aff8?q=80&w=1200',
  ],
};

const counters = {};
const getImage = (category) => {
  if (!counters[category]) counters[category] = 0;
  const imgs = categoryImages[category] || categoryImages['Other'];
  const img = imgs[counters[category] % imgs.length];
  counters[category]++;
  return img;
};

const run = async () => {
  await connectDB();

  // Step 1: Fix specific named artworks first
  for (const [title, url] of Object.entries(specificFixes)) {
    const result = await Artwork.updateMany({ title }, { imageUrl: url });
    if (result.modifiedCount > 0) console.log(`✓ Fixed specific: "${title}"`);
  }

  // Step 2: Fix ALL remaining broken ones (not starting with http)
  const broken = await Artwork.find({ imageUrl: { $not: /^https?:\/\// } });
  console.log(`Found ${broken.length} more artworks with broken image URLs.`);
  for (const art of broken) {
    const newUrl = getImage(art.category);
    await Artwork.findByIdAndUpdate(art._id, { imageUrl: newUrl });
    console.log(`  Fixed: "${art.title}" (${art.category})`);
  }

  // Step 3: Also fix any artworks that still have the old Wikipedia/bad URLs (optional)
  const allArts = await Artwork.find({});
  console.log(`\nTotal artworks in DB: ${allArts.length}`);
  console.log('Sample URLs:');
  allArts.slice(0, 5).forEach(a => console.log(`  "${a.title}": ${a.imageUrl?.substring(0, 60)}`));

  console.log('\n✅ All image URLs patched!');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
