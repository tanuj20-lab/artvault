require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Artwork = require('./models/Artwork');

// Specifically target the 5 remaining broken artworks by title + category
const FIXES = [
  {
    titles: ['Sketch Masterpiece 2', 'Sketch Masterpiece 3'],
    images: [
      'https://images.unsplash.com/photo-1572944919953-0d631ffe5ccb?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581452267995-1f9518d6e3fb?q=80&w=900&auto=format&fit=crop',
    ],
  },
  {
    titles: ['Photography Masterpiece 2'],
    images: [
      'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=900&auto=format&fit=crop',
    ],
  },
  {
    titles: ['Sculpture Masterpiece 2', 'Sculpture Masterpiece 3'],
    images: [
      'https://images.unsplash.com/photo-1620503292163-b838f7a49180?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=900&auto=format&fit=crop',
    ],
  },
];

const run = async () => {
  await connectDB();

  let count = 0;
  for (const fix of FIXES) {
    for (let i = 0; i < fix.titles.length; i++) {
      const title = fix.titles[i];
      const newUrl = fix.images[i] || fix.images[0];
      const result = await Artwork.findOneAndUpdate(
        { title },
        { $set: { imageUrl: newUrl } },
        { new: true }
      );
      if (result) {
        console.log(`✅ Fixed: "${title}"`);
        count++;
      } else {
        console.log(`⚠️  Not found: "${title}"`);
      }
    }
  }

  console.log(`\n🎨 Done! Fixed ${count} artwork(s).\n`);
  process.exit(0);
};

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
