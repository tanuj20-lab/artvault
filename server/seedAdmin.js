require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const email = 'admin@demo.com';
  let adminUser = await User.findOne({ email });
  
  if (!adminUser) {
    adminUser = new User({
      name: 'System Admin',
      email: email,
      password: 'password123',
      role: 'admin',
      bio: 'Administrator account'
    });
    await adminUser.save();
    console.log('✅ Created new admin: admin@demo.com / password123');
  } else {
    adminUser.role = 'admin';
    await adminUser.save();
    console.log('✅ Promoted admin@demo.com to admin role.');
  }

  process.exit(0);
}).catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
