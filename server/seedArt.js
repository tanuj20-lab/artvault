require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Artwork = require('./models/Artwork');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const artist = await User.findOne({ email: 'artist@demo.com' });
  if (!artist) {
    console.log('No artist found. Please ensure artist@demo.com exists.');
    process.exit(1);
  }

  const artworks = [
    {
      title: 'The Royal Renaissance',
      description: 'A masterpiece capturing the essence of the 16th century royal court with deep crimson and burnished gold strokes.',
      category: 'Painting',
      medium: 'Oil on Canvas',
      dimensions: '120x90 cm',
      basePrice: 5000,
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
      status: 'available',
      isFeatured: true,
      tags: ['Renaissance', 'Royal', 'Classical']
    },
    {
      title: 'Midnight Majesty',
      description: 'An abstract interpretation of the night sky over a royal palace, featuring striking midnight navy tones.',
      category: 'Painting',
      medium: 'Acrylic',
      dimensions: '100x100 cm',
      basePrice: 3500,
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80',
      status: 'available',
      isFeatured: false,
      tags: ['Abstract', 'Midnight', 'Modern']
    },
    {
      title: 'Golden Dynasty Vases',
      description: 'A photograph of exquisite royal vases, showcasing intricate gold leaf patterns.',
      category: 'Photography',
      medium: 'Digital Print',
      dimensions: '60x80 cm',
      basePrice: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1605338153400-f94bb808d2ae?auto=format&fit=crop&q=80',
      status: 'available',
      isFeatured: true,
      tags: ['Photography', 'Gold', 'Still Life']
    }
  ];

  for (let art of artworks) {
    art.artistId = artist._id;
    const newArt = new Artwork(art);
    await newArt.save();
  }

  console.log(`✅ Added ${artworks.length} artworks successfully.`);
  process.exit(0);
}).catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
