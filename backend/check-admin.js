const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');

async function checkAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bible-quiz');
    console.log('✅ Connected to MongoDB\n');

    // Check for admin accounts
    const admins = await Admin.find();
    
    if (admins.length === 0) {
      console.log('❌ No admin accounts found in database!');
      console.log('\nRun: node update-admin.js to create an admin account');
    } else {
      console.log(`✅ Found ${admins.length} admin account(s):\n`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Username: ${admin.username}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log('');
      });
    }
    
    // Check for dmaestro specifically
    const dmaestro = await Admin.findOne({ username: 'dmaestro' });
    if (dmaestro) {
      console.log('✅ Admin "dmaestro" exists');
    } else {
      console.log('❌ Admin "dmaestro" does NOT exist');
      console.log('Run: node update-admin.js to create it');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  MongoDB is not running or not accessible!');
      console.error('Please check your MongoDB connection.');
    }
    process.exit(1);
  }
}

checkAdmin();

