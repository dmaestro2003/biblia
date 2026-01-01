# MongoDB Connection String for Render

## Important: Use MongoDB Atlas (Cloud), NOT Localhost!

Since your backend is deployed on Render (cloud), you **cannot use** `mongodb://localhost:27017/` because:
- Render servers don't have local MongoDB installed
- Localhost would refer to the Render server, not your computer
- You need a cloud database like MongoDB Atlas

## Step 1: Get MongoDB Atlas Connection String

If you don't have MongoDB Atlas yet:

1. **Sign up for free**: https://www.mongodb.com/cloud/atlas
2. **Create a free cluster** (M0 tier)
3. **Create database user**:
   - Go to "Database Access"
   - Add user with username/password
4. **Whitelist IP**: 
   - Go to "Network Access"
   - Add IP: `0.0.0.0/0` (allows all IPs) for development
5. **Get connection string**:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

Your connection string will look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bible-quiz?retryWrites=true&w=majority
```

## Step 2: Configure for Your App

### Format for Bible Quiz App:

1. **Replace placeholders:**
   - `<username>` → Your MongoDB Atlas username
   - `<password>` → Your MongoDB Atlas password
   - `cluster0.xxxxx` → Your actual cluster name

2. **Add database name:**
   - Change `/` to `/bible-quiz?` (before the `?`)
   - Or add `?retryWrites=true&w=majority` if already has `?`

**Final format:**
```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/bible-quiz?retryWrites=true&w=majority
```

## Step 3: Add to Render Environment Variables

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your backend service
3. Go to "Environment" tab
4. Add these environment variables:

   **Variable Name:** `MONGODB_URI`  
   **Value:** `mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/bible-quiz?retryWrites=true&w=majority`

   **Variable Name:** `JWT_SECRET`  
   **Value:** `your-super-secret-key-change-this-12345`

   **Variable Name:** `NODE_ENV`  
   **Value:** `production`

   **Variable Name:** `PORT`  
   **Value:** (Leave empty - Render sets this automatically)

5. Click "Save Changes"
6. Render will automatically redeploy your service

## Step 4: Create Admin Account on Render

After your backend redeploys with MongoDB connected:

1. In Render dashboard, click your backend service
2. Click "Shell" tab
3. Run this command:
   ```bash
   node update-admin.js
   ```
   
   Or if that doesn't work:
   ```bash
   node seed.js
   ```

4. You should see:
   ```
   ✅ Connected to MongoDB
   ✅ Created admin account (username: dmaestro, password: 1234dmaestro)
   ```

## Step 5: Test Connection

1. In Render, check your backend logs
2. You should see: `✅ Connected to MongoDB`
3. If you see errors, check:
   - MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - Username/password in connection string are correct
   - Database user has proper permissions

## Example MongoDB Atlas Connection String:

```
mongodb+srv://biblequiz:MySecurePassword123@cluster0.abc123.mongodb.net/bible-quiz?retryWrites=true&w=majority
```

## Troubleshooting:

### Error: "IP not whitelisted"
- Go to MongoDB Atlas → Network Access
- Add IP: `0.0.0.0/0` (allows all IPs)

### Error: "Authentication failed"
- Check username and password in connection string
- Make sure special characters in password are URL-encoded
- Example: `@` becomes `%40`, `#` becomes `%23`

### Error: "Server selection timed out"
- Check MongoDB Atlas cluster is running (not paused)
- Verify connection string format is correct
- Check network access settings

