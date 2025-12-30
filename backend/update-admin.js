const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');

async function updateAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bible-quiz');
    console.log('✅ Connected to MongoDB');

    // Delete old admin accounts (both 'admin' and 'dmaestro' to be safe)
    await Admin.deleteMany({ username: { $in: ['admin', 'dmaestro'] } });
    console.log('🗑️  Removed old admin accounts');

    // Create new admin account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('1234dmaestro', salt);
    
    await Admin.create({
      username: 'dmaestro',
      password: hashedPassword
    });
    
    console.log('✅ Created admin account:');
    console.log('   Username: dmaestro');
    console.log('   Password: 1234dmaestro');
    console.log('\n🎉 Admin account updated successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    process.exit(1);
  }
}

updateAdmin();

