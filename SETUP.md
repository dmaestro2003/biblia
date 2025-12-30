# Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install MongoDB
- **Option A (Local)**: Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
- **Option B (Cloud - Recommended)**: Create a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bible-quiz
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bible-quiz?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

Seed the database:
```bash
node seed.js
```

Start backend:
```bash
npm start
# or for development:
npm run dev
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in `frontend/` (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

### Step 4: Access the Application
- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
  - Username: `admin`
  - Password: `admin123`

## ⚠️ Important First Steps

1. **Change Default Admin Password**: After first login, create a new admin account or change the password
2. **Add Questions**: Use the admin panel to add more questions for each level
3. **Test the Quiz**: Play a quiz game to ensure everything works

## 📝 Default Credentials

- **Admin Username**: `dmaestro`
- **Admin Password**: `1234dmaestro`

**⚠️ CHANGE THESE IMMEDIATELY IN PRODUCTION!**

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running (if using local MongoDB)
- Check your connection string in `.env`
- Verify network access (if using MongoDB Atlas)

### Port Already in Use
- Backend: Change `PORT` in `.env` (default: 5000)
- Frontend: React will prompt to use a different port automatically

### Questions Not Loading
- Run `node backend/seed.js` to seed the database
- Check MongoDB connection
- Verify questions exist in the database

## 🌐 Deployment Checklist

1. ✅ Change default admin password
2. ✅ Set strong `JWT_SECRET` in production `.env`
3. ✅ Use MongoDB Atlas for production
4. ✅ Update `REACT_APP_API_URL` to production backend URL
5. ✅ Build frontend: `npm run build`
6. ✅ Configure CORS on backend for production domain
7. ✅ Set `NODE_ENV=production` in backend `.env`

## 📚 Need More Help?

See the full README.md for detailed documentation.

