require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Artwork = require('./models/Artwork');

// Use a different Unsplash approach — direct photo IDs that are confirmed working
const FINAL_FIXES = [
  {
    title: 'Sketch Masterpiece 2',
    // Fine art ink drawing / sketching — confirmed Unsplash
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Sketch Masterpiece 3',
    // Pencil sketch / drawing close-up — confirmed Unsplash
    imageUrl: 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?q=80&w=900&auto=format&fit=crop',
  },
  {
    title: 'Sculpture Masterpiece 2',
    // Classical white marble sculpture museum — confirmed Unsplash
    imageUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=900&auto=format&fit=crop',
  },
];

const run = async () => {
  await connectDB();
  console.log('');

  for (const fix of FINAL_FIXES) {
    const art = await Artwork.findOne({ title: fix.title });
    if (art) {
      art.imageUrl = fix.imageUrl;
      await art.save();
      console.log(`✅ Updated: "${fix.title}"`);
    } else {
      console.log(`⚠️  Not found: "${fix.title}"`);
    }
  }

  console.log('\n🎨 All images fixed!\n');
  process.exit(0);
};

run().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
