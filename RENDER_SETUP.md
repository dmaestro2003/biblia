# Setting Up Frontend with Render Backend

## Step 1: Get Your Render Backend URL

Your Render backend URL should look like:
- `https://your-app-name.onrender.com`
- Or: `https://bible-quiz-backend.onrender.com` (example)

**To find it:**
1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your backend service
3. Look at the top - you'll see the URL (e.g., `https://your-service.onrender.com`)

## Step 2: Update Frontend Environment Variable

Create or update the `.env` file in the `frontend/` folder:

### Option A: Create `.env` file in `frontend/` folder

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

**Replace `your-backend-url.onrender.com` with your actual Render backend URL!**

### Option B: Temporary fix - Update api.js directly

If you want to test quickly, you can temporarily update `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

## Step 3: Restart Frontend

After updating the `.env` file:

1. Stop the frontend (Ctrl+C if running)
2. Restart it:
   ```bash
   cd frontend
   npm start
   ```

## Step 4: Verify Backend is Running

1. Open your browser
2. Go to: `https://your-backend-url.onrender.com/api/health`
3. You should see: `{"status":"OK","message":"Bible Quiz API is running"}`

## Step 5: Create Admin Account on Render Backend

Since your backend is now on Render, you need to create the admin account there:

### Method 1: Use Render Shell (Recommended)

1. Go to your Render dashboard
2. Click on your backend service
3. Click "Shell" tab
4. Run these commands:
   ```bash
   cd backend
   node update-admin.js
   ```

### Method 2: Create a one-time script

Create a file called `create-admin.js` in your backend root:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Admin.deleteMany({ username: { $in: ['admin', 'dmaestro'] } });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('1234dmaestro', salt);
    
    await Admin.create({
      username: 'dmaestro',
      password: hashedPassword
    });
    
    console.log('✅ Admin created: dmaestro / 1234dmaestro');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
```

Then deploy it and run it once.

## Important Notes:

1. **CORS**: Your backend already has `app.use(cors())` which allows all origins. This should work, but if you have issues, update it in `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:3000', 'https://your-frontend-domain.com']
   }));
   ```

2. **Environment Variables on Render**:
   - Make sure you've set these in Render dashboard:
     - `MONGODB_URI` - Your MongoDB connection string
     - `JWT_SECRET` - A secret key for JWT tokens
     - `NODE_ENV` - Set to `production`

3. **MongoDB**: Make sure your MongoDB Atlas IP whitelist includes:
   - `0.0.0.0/0` (all IPs) for development
   - Or Render's IP ranges (check Render docs)

## Testing:

1. Frontend should now connect to Render backend
2. Try logging in with:
   - Username: `dmaestro`
   - Password: `1234dmaestro`

