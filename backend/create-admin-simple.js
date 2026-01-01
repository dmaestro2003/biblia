const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set ✅' : 'Not set ❌');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
      console.error('Please set MONGODB_URI in your .env file or Render environment variables.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete old admin accounts
    const deleteResult = await Admin.deleteMany({ username: { $in: ['admin', 'dmaestro'] } });
    console.log(`🗑️  Removed ${deleteResult.deletedCount} old admin account(s)`);

    // Create new admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('1234dmaestro', salt);
    
    const admin = await Admin.create({
      username: 'dmaestro',
      password: hashedPassword
    });
    
    console.log('\n✅ Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Username: dmaestro');
    console.log('   Password: 1234dmaestro');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  MongoDB connection failed!');
      console.error('Possible causes:');
      console.error('  1. MongoDB is not running (if using local MongoDB)');
      console.error('  2. Connection string is incorrect');
      console.error('  3. IP address not whitelisted in MongoDB Atlas');
      console.error('  4. Wrong username or password');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n⚠️  Authentication failed!');
      console.error('Check your username and password in the connection string.');
    }
    
    process.exit(1);
  }
}

createAdmin();


