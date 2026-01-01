const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

async function checkLoginIssues() {
  console.log('🔍 Checking Login Issues...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check 1: MongoDB Connection String
  console.log('1️⃣  Checking MONGODB_URI...');
  if (!process.env.MONGODB_URI) {
    console.log('   ❌ MONGODB_URI is NOT set!');
    console.log('   ⚠️  Fix: Set MONGODB_URI in Render environment variables\n');
  } else {
    console.log('   ✅ MONGODB_URI is set');
    // Hide password for security
    const uri = process.env.MONGODB_URI;
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log(`   📝 URI: ${maskedUri}\n`);
  }

  // Check 2: Try to connect to MongoDB
  console.log('2️⃣  Testing MongoDB connection...');
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bible-quiz');
    console.log('   ✅ Successfully connected to MongoDB!\n');
    
    // Check 3: Check if admin exists
    console.log('3️⃣  Checking admin accounts...');
    const admins = await Admin.find({});
    console.log(`   📊 Found ${admins.length} admin account(s) in database\n`);
    
    if (admins.length === 0) {
      console.log('   ❌ NO ADMIN ACCOUNTS FOUND!');
      console.log('   ⚠️  Fix: Run "node create-admin-simple.js" to create admin\n');
    } else {
      console.log('   ✅ Admin accounts found:');
      admins.forEach((admin, index) => {
        console.log(`      ${index + 1}. Username: "${admin.username}"`);
        console.log(`         Created: ${admin.createdAt}`);
      });
      console.log();
      
      // Check for dmaestro specifically
      const dmaestro = await Admin.findOne({ username: 'dmaestro' });
      if (dmaestro) {
        console.log('   ✅ Admin "dmaestro" exists!\n');
      } else {
        console.log('   ❌ Admin "dmaestro" does NOT exist!');
        console.log('   ⚠️  Fix: Run "node create-admin-simple.js" to create it\n');
      }
    }
    
    // Check 4: Test password
    console.log('4️⃣  Testing password...');
    const testAdmin = await Admin.findOne({ username: 'dmaestro' });
    if (testAdmin) {
      const bcrypt = require('bcryptjs');
      const testPassword = '1234dmaestro';
      const isMatch = await bcrypt.compare(testPassword, testAdmin.password);
      if (isMatch) {
        console.log('   ✅ Password "1234dmaestro" is CORRECT!\n');
      } else {
        console.log('   ❌ Password "1234dmaestro" does NOT match!');
        console.log('   ⚠️  The admin account exists but password is wrong\n');
      }
    }
    
    await mongoose.connection.close();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.log('   ❌ Failed to connect to MongoDB!');
    console.log(`   Error: ${error.message}\n`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('   ⚠️  MongoDB is not accessible');
      console.log('   Possible causes:');
      console.log('      - MongoDB Atlas cluster is paused');
      console.log('      - Connection string is incorrect');
      console.log('      - IP address not whitelisted\n');
    } else if (error.message.includes('authentication failed')) {
      console.log('   ⚠️  Authentication failed');
      console.log('   Check username and password in connection string\n');
    }
  }

  // Check 5: Summary and Recommendations
  console.log('📋 SUMMARY & NEXT STEPS:\n');
  console.log('1. If MONGODB_URI not set → Add it in Render environment variables');
  console.log('2. If MongoDB connection fails → Check connection string and IP whitelist');
  console.log('3. If no admin account → Run: node create-admin-simple.js');
  console.log('4. If still not working → Check Render backend logs\n');
  
  process.exit(0);
}

checkLoginIssues();


