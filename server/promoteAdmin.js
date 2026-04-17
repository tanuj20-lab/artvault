require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await mongoose.connection.db.collection('users').updateOne(
    { email: 'admin@demo.com' },
    { $set: { role: 'admin' } }
  );
  console.log('✅ Promoted admin@demo.com to admin role. Modified:', result.modifiedCount);
  process.exit(0);
}).catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
