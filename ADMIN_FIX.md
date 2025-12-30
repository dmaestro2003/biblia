# Fix Admin Login Issue

If you're having trouble logging in, follow these steps:

## Quick Fix - Update Admin Account

Run this command to update/create the admin account:

```bash
cd backend
node update-admin.js
```

This will:
1. Delete any existing admin accounts (old or new)
2. Create a fresh admin account with the correct credentials

## Manual Fix Options

### Option 1: Delete and Re-seed (Recommended)

1. Connect to MongoDB and delete the admin collection:
   ```bash
   # Using MongoDB Compass or mongosh
   # Delete the admins collection, or just delete the admin document
   ```

2. Run the seed script again:
   ```bash
   cd backend
   node seed.js
   ```

### Option 2: Use the Update Script

Just run:
```bash
cd backend
node update-admin.js
```

## Verify Your Credentials

After running the update script, use these credentials:

- **Username:** `dmaestro`
- **Password:** `1234dmaestro`

Login URL: `http://localhost:3000/admin/login`

## Still Not Working?

1. **Check MongoDB is running**: Make sure MongoDB is connected
2. **Check the backend is running**: Ensure the backend server is running
3. **Check browser console**: Look for any JavaScript errors
4. **Clear browser cache**: Clear localStorage and cookies
5. **Check network tab**: See if the login request is being sent correctly

## Common Issues

### "Invalid credentials"
- Make sure you're using: `dmaestro` / `1234dmaestro`
- Run `node update-admin.js` to reset the account

### "Cannot connect to server"
- Make sure backend is running on port 5000
- Check your `.env` file has the correct `MONGODB_URI`

### "Admin account already exists" error
- This is fine - the update script will delete it first and create a new one

