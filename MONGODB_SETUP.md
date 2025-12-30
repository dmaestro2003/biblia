# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

MongoDB Atlas is a free cloud-hosted MongoDB service. This is the easiest option for getting started.

### Steps:

1. **Create Account**: Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for free

2. **Create Cluster**: 
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select a cloud provider and region
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**:
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add only your server's IP address
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" in the left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `bible-quiz` (or keep the default)

   Example connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bible-quiz?retryWrites=true&w=majority
   ```

6. **Update .env file**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bible-quiz?retryWrites=true&w=majority
   ```

## Option 2: Local MongoDB Installation

### Windows:

1. **Download MongoDB**: 
   - Go to [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select Windows and download the MSI installer

2. **Install MongoDB**:
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (optional GUI tool)

3. **Verify Installation**:
   - MongoDB should start automatically as a Windows Service
   - You can check in Services (services.msc) - look for "MongoDB"

4. **Manual Start (if not running as service)**:
   ```powershell
   # Navigate to MongoDB bin directory (usually):
   cd "C:\Program Files\MongoDB\Server\7.0\bin"
   
   # Start MongoDB
   mongod.exe
   ```

5. **Test Connection**:
   - MongoDB runs on `localhost:27017` by default
   - Your `.env` file should have:
     ```env
     MONGODB_URI=mongodb://localhost:27017/bible-quiz
     ```

### macOS:

1. **Install using Homebrew** (recommended):
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**:
   ```bash
   brew services start mongodb-community
   ```

3. **Or start manually**:
   ```bash
   mongod --config /usr/local/etc/mongod.conf
   ```

### Linux (Ubuntu/Debian):

1. **Import MongoDB public GPG key**:
   ```bash
   curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
      sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
      --dearmor
   ```

2. **Add MongoDB repository**:
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Install MongoDB**:
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB**:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod  # Start on boot
   ```

## Troubleshooting Connection Issues

### Error: `ECONNREFUSED 127.0.0.1:27017`

This means MongoDB is not running. Try:

1. **Check if MongoDB is running**:
   - Windows: Check Services (services.msc) or Task Manager
   - macOS: `brew services list`
   - Linux: `sudo systemctl status mongod`

2. **Start MongoDB**:
   - Windows: Start the MongoDB service or run `mongod.exe`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Check MongoDB logs**:
   - Windows: Check Event Viewer or MongoDB log files
   - macOS/Linux: `tail -f /var/log/mongodb/mongod.log`

### Using MongoDB Atlas but getting connection errors:

1. **Check IP Whitelist**: Make sure your IP is whitelisted
2. **Check Username/Password**: Verify in `.env` file
3. **Check Connection String**: Make sure it's correct and `<password>` is replaced
4. **Check Network**: Some corporate networks block MongoDB connections

### Quick Test:

Test MongoDB connection directly:
```bash
# Windows
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongo.exe

# macOS/Linux
mongosh
```

If this connects, MongoDB is running correctly.

## Recommendation

For development and production, **MongoDB Atlas (free tier) is recommended** because:
- ✅ No installation needed
- ✅ Works from anywhere
- ✅ Automatic backups
- ✅ Easy to scale
- ✅ Free tier is sufficient for this project

