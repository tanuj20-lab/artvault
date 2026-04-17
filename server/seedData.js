require('dotenv').config();
const mongoose = require('mongoose');
const Artwork = require('./models/Artwork');
const User = require('./models/User');
const connectDB = require('./config/db');

const categories = ['Painting', 'Sculpture', 'Photography', 'Digital Art', 'Sketch', 'Mixed Media', 'Other'];

// Demo Images mapped by category
const demoImages = {
  'Painting': [
    'https://images.unsplash.com/photo-1578301978693-85fa9c03fa75?q=80&w=800',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800',
    'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=800'
  ],
  'Sculpture': [
    'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800',
    'https://images.unsplash.com/photo-1490806840058-208b0c681283?q=80&w=800',
    'https://images.unsplash.com/photo-1563214878-1cf0ff1ebcd8?q=80&w=800'
  ],
  'Photography': [
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800',
    'https://images.unsplash.com/photo-1506744626753-1fa7604d4fc9?q=80&w=800',
    'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=800'
  ],
  'Digital Art': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800'
  ],
  'Sketch': [
    'https://images.unsplash.com/photo-1510936111840-65e151ad71bb?q=80&w=800',
    'https://images.unsplash.com/photo-1581452267995-1f9518d6e3fb?q=80&w=800',
    'https://images.unsplash.com/photo-1534960585646-681b95ff3739?q=80&w=800'
  ],
  'Mixed Media': [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800',
    'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=800'
  ],
  'Other': [
    'https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=800',
    'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=800',
    'https://images.unsplash.com/photo-1456086272160-b28b0645b729?q=80&w=800'
  ]
};

const run = async () => {
  await connectDB();
  
  // Find or create an artist user
  let artist = await User.findOne({ role: 'artist' });
  if (!artist) {
    artist = await User.create({
      name: 'Seed Artist',
      email: 'seedartist@example.com',
      password: 'password123',
      role: 'artist'
    });
  }

  // Find or create another artist just to mix things up
  let artist2 = await User.findOne({ email: 'seedartist2@example.com' });
  if (!artist2) {
    artist2 = await User.create({
      name: 'Creative Soul',
      email: 'seedartist2@example.com',
      password: 'password123',
      role: 'artist'
    });
  }

  const artists = [artist._id, artist2._id];

  for (const cat of categories) {
    console.log(`Seeding category: ${cat}`);
    for (let i = 0; i < 3; i++) {
        const imageUrl = demoImages[cat][i] || demoImages[cat][0];
        await Artwork.create({
          artistId: artists[i % artists.length],
          title: `${cat} Masterpiece ${i + 1}`,
          description: `An exquisite representation of ${cat} showcasing incredible technique and vision. This is a unique piece that captures the essence of the medium.`,
          category: cat,
          medium: `${cat} materials`,
          dimensions: `${20 + i * 5}x${30 + i * 5} inches`,
          basePrice: 5000 + Math.floor(Math.random() * 20000),
          imageUrl: imageUrl,
          status: 'available',
        });
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
