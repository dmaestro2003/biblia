# Admin Login Troubleshooting Guide

## ❌ Current Problem: MongoDB Not Connected

You're seeing login errors because **MongoDB is not running**. The admin account cannot exist without MongoDB being connected.

## ✅ Solution: Set Up MongoDB First

You have 2 options:

---

## Option 1: MongoDB Atlas (Cloud - EASIEST) ⭐ Recommended

**Why choose this?** No installation needed, works immediately.

### Steps:

1. **Sign up for free**: Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Create account (use Google/GitHub for faster signup)

2. **Create a free cluster**:
   - Click "Build a Database"
   - Choose **FREE** tier (M0)
   - Select a cloud provider (any is fine)
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access" (left menu)
   - Click "Add New Database User"
   - Authentication: "Password"
   - Username: `biblequiz` (or any username)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist IP Address**:
   - Go to "Network Access" (left menu)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" (left menu)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like this):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name: Change `/` to `/bible-quiz?` (before the `?`)
   - Final should look like:
     ```
     mongodb+srv://biblequiz:YOURPASSWORD@cluster0.xxxxx.mongodb.net/bible-quiz?retryWrites=true&w=majority
     ```

6. **Update `.env` file** in `backend/` folder:
   ```env
   MONGODB_URI=mongodb+srv://biblequiz:YOURPASSWORD@cluster0.xxxxx.mongodb.net/bible-quiz?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your-super-secret-key-12345
   NODE_ENV=development
   ```

7. **Create admin account**:
   ```bash
   cd backend
   node update-admin.js
   ```

8. **Start backend**:
   ```bash
   npm start
   ```

---

## Option 2: Local MongoDB Installation

### For Windows:

1. **Download MongoDB**: https://www.mongodb.com/try/download/community
   - Select Windows
   - Download MSI installer

2. **Install MongoDB**:
   - Run the installer
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (optional GUI)
   - Click "Install"

3. **Verify MongoDB is running**:
   - Open "Services" (search "services" in Windows)
   - Look for "MongoDB" service
   - Should be "Running"

4. **If not running**:
   - Right-click "MongoDB" service → "Start"

5. **Update `.env` file** in `backend/` folder:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bible-quiz
   PORT=5000
   JWT_SECRET=your-super-secret-key-12345
   NODE_ENV=development
   ```

6. **Create admin account**:
   ```bash
   cd backend
   node update-admin.js
   ```

7. **Start backend**:
   ```bash
   npm start
   ```

---

## After MongoDB is Set Up:

### Step 1: Create Admin Account
```bash
cd backend
node update-admin.js
```

You should see:
```
✅ Connected to MongoDB
🗑️  Removed old admin accounts
✅ Created admin account:
   Username: dmaestro
   Password: 1234dmaestro
🎉 Admin account updated successfully!
```

### Step 2: Make Sure Backend is Running
```bash
cd backend
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### Step 3: Login
1. Go to: http://localhost:3000/admin/login
2. Enter:
   - Username: `dmaestro`
   - Password: `1234dmaestro`
3. Click "Ingia" (Login)

---

## Quick Check Commands

### Check if admin exists:
```bash
cd backend
node check-admin.js
```

### Check if MongoDB is connected:
```bash
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bible-quiz').then(() => { console.log('✅ MongoDB connected!'); process.exit(0); }).catch(err => { console.log('❌ Error:', err.message); process.exit(1); });"
```

---

## Still Having Issues?

### Common Problems:

1. **"Invalid credentials"**
   - Make sure you ran `node update-admin.js` AFTER MongoDB was connected
   - Check username: `dmaestro` (lowercase)
   - Check password: `1234dmaestro`

2. **"Cannot connect to server"**
   - Make sure backend is running (`npm start` in backend folder)
   - Check backend is on port 5000
   - Check browser console for errors

3. **MongoDB connection errors**
   - For Atlas: Check IP whitelist includes your IP
   - For Local: Check MongoDB service is running
   - Verify `.env` file has correct `MONGODB_URI`

---

## Need Help?

1. Run `node check-admin.js` to see current status
2. Check backend console for error messages
3. Check browser console (F12) for network errors


