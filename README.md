# Bible Quiz ya Watoto

A complete Bible Quiz Web Application for church children (ages 5-13) built with React.js, Node.js, Express.js, and MongoDB.

## 🎯 Features

- **Interactive Quiz System**: Multiple-choice questions with timer
- **Three Difficulty Levels**: Easy (ages 5-7), Medium (ages 8-10), Hard (ages 11-13)
- **Score Tracking**: Automatic score calculation and saving
- **Leaderboard**: Top 10 players display
- **Learning Feedback**: Shows correct answers and Bible verses after each question
- **Admin Panel**: Secure admin interface to manage questions and view results
- **Child-Friendly UI**: Beautiful, colorful, and engaging design
- **Responsive Design**: Works on both mobile and desktop devices

## 🧱 Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bible-quiz
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

4. Start MongoDB (if using local MongoDB):
```bash
# On Windows (if MongoDB is installed as a service, it should start automatically)
# On Mac/Linux:
mongod
```

5. Seed the database with sample questions and create default admin:
```bash
node seed.js
```

Default admin credentials:
- Username: `dmaestro`
- Password: `1234dmaestro`

**⚠️ IMPORTANT**: Change the default admin password after first login!

6. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend API will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional, defaults to localhost:5000):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## 🚀 Usage

### For Children (Players)

1. Open the application in a web browser
2. Click "Anza Mchezo" (Start Game)
3. Enter your name
4. Select your difficulty level (Easy, Medium, or Hard)
5. Answer the quiz questions (10 questions per quiz)
6. View your results and motivational message
7. Check the leaderboard to see top 10 players

### For Administrators

1. Navigate to `/admin/login`
2. Login with admin credentials
3. **Questions Tab**: 
   - Add new questions
   - Edit existing questions
   - Delete questions
   - Questions must have 4 options, correct answer, level, and Bible verse
4. **Scores Tab**:
   - View all quiz results
   - See statistics (total scores, total questions, average score)

## 📊 Database Schema

### Questions Collection
```javascript
{
  question: String (required),
  options: Array of 4 strings (required),
  correctAnswer: String (required),
  level: String (enum: 'Easy', 'Medium', 'Hard') (required),
  bibleVerse: String (required),
  createdAt: Date
}
```

### Scores Collection
```javascript
{
  playerName: String (required),
  score: Number (required),
  level: String (enum: 'Easy', 'Medium', 'Hard') (required),
  createdAt: Date
}
```

### Admins Collection
```javascript
{
  username: String (required, unique),
  password: String (hashed) (required),
  createdAt: Date
}
```

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the production version:
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in the frontend directory
   - Set environment variable: `REACT_APP_API_URL` to your backend API URL

3. **Deploy to Netlify:**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Set environment variable: `REACT_APP_API_URL` to your backend API URL

### Backend Deployment (Render/Railway/Heroku)

1. **Using Render:**
   - Create a new Web Service
   - Connect your GitHub repository
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`
   - Set environment variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A strong random secret
     - `PORT`: (usually auto-set by Render)
     - `NODE_ENV`: `production`

2. **Using Railway:**
   - Create a new project
   - Add a new service (Node.js)
   - Set root directory to `backend`
   - Add environment variables (same as Render)
   - Deploy

3. **Using Heroku:**
   - Create a Heroku app
   - Add MongoDB addon (MongoDB Atlas recommended)
   - Set environment variables
   - Deploy using Git or Heroku CLI

### MongoDB Setup (MongoDB Atlas - Recommended for Production)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs - less secure)
5. Get your connection string
6. Update `MONGODB_URI` in your backend `.env` file

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bible-quiz?retryWrites=true&w=majority
```

### CORS Configuration

If deploying frontend and backend separately, make sure CORS is configured in the backend. The current setup allows all origins. For production, consider restricting CORS to your frontend domain:

```javascript
// In backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

## 🔐 Security Notes

1. **Change Default Admin Password**: After first login, create a new admin account with a strong password
2. **JWT Secret**: Use a strong, random secret in production
3. **MongoDB**: Use MongoDB Atlas with proper authentication
4. **Environment Variables**: Never commit `.env` files to version control
5. **CORS**: Restrict CORS to your frontend domain in production

## 📝 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/questions/random/:level?count=10` - Get random questions by level
- `POST /api/questions/verify/:id` - Verify answer
- `POST /api/scores` - Submit score
- `GET /api/scores/leaderboard` - Get top 10 scores

### Admin Endpoints (Requires JWT Token)
- `POST /api/auth/login` - Admin login
- `GET /api/questions/all` - Get all questions
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `GET /api/admin/scores` - Get all scores
- `GET /api/admin/stats` - Get statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available for church use.

## ❓ Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (if using local MongoDB)
- Check your connection string in `.env`
- Verify network access (if using MongoDB Atlas)

### CORS Errors
- Ensure backend CORS is configured correctly
- Check that frontend `REACT_APP_API_URL` points to correct backend URL

### Authentication Issues
- Clear browser localStorage and try logging in again
- Verify JWT_SECRET matches between token creation and verification

### Questions Not Loading
- Ensure database is seeded: `node backend/seed.js`
- Check backend logs for errors
- Verify MongoDB connection

## 🙏 Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Built with ❤️ for teaching children about the Bible**

