# ⚡ QUICK START - 5 Step Setup

## Step 1: MongoDB Atlas (5 min)
1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create FREE cluster (M0)
3. Create user → Whitelist IP (0.0.0.0/0)
4. Get connection string → Format: `mongodb+srv://user:pass@cluster.net/bible-quiz?retryWrites=true&w=majority`

## Step 2: Add to Render (2 min)
1. Render Dashboard → Your backend → Environment tab
2. Add:
   - `MONGODB_URI` = your connection string from Step 1
   - `JWT_SECRET` = any random string
   - `NODE_ENV` = production
3. Save (auto-redeploys)

## Step 3: Create Admin (1 min)
1. Render → Your backend → Shell tab
2. Run: `node create-admin-simple.js`
3. ✅ Should see "Admin account created"

## Step 4: Get Render URL (30 sec)
1. Render Dashboard → Your backend
2. Copy URL (top of page): `https://your-app.onrender.com`

## Step 5: Update Frontend (1 min)
1. Create/edit `frontend/.env`:
   ```
   REACT_APP_API_URL=https://your-app.onrender.com/api
   ```
2. Restart frontend: `npm start`

## ✅ Test Login
- Go to: http://localhost:3000/admin/login
- Username: `dmaestro`
- Password: `1234dmaestro`

🎉 Done!

See `SETUP_COMPLETE_GUIDE.md` for detailed instructions.


