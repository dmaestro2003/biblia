# Frontend Environment Configuration

## Create .env file in frontend folder

Create a file named `.env` in the `frontend/` folder with this content:

```env
REACT_APP_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
```

**Replace `YOUR-BACKEND-URL.onrender.com` with your actual Render backend URL!**

Example:
```env
REACT_APP_API_URL=https://bible-quiz-backend-abc123.onrender.com/api
```

## Steps:

1. **Find your Render backend URL:**
   - Go to: https://dashboard.render.com
   - Click on your backend service
   - Copy the URL shown at the top (e.g., `https://bible-quiz-backend.onrender.com`)

2. **Create `.env` file:**
   - Navigate to `frontend/` folder
   - Create a new file named `.env` (not `.env.example`, just `.env`)
   - Add the line above with your actual URL

3. **Restart frontend:**
   ```bash
   # Stop the frontend (Ctrl+C if running)
   # Then restart:
   cd frontend
   npm start
   ```

4. **Verify it works:**
   - Try logging in again
   - Check browser console (F12) - should see requests going to your Render URL instead of localhost

## Important:

- The URL should NOT end with `/api/api` - it should be `https://your-url.onrender.com/api`
- Make sure there's no trailing slash
- After creating `.env`, you MUST restart the React development server for changes to take effect

