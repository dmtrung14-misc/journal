# Production Deployment Guide

## Storage: Firebase + Cloudinary

This application uses:
- **Firebase Firestore** for posts and profile data
- **Cloudinary** for images only

Both are free tier friendly!

## Why This Setup?

- ✅ **Firebase Firestore**: Perfect for structured data (posts, profile)
  - Free tier: 50K reads/day, 20K writes/day, 20K deletes/day
  - Real-time updates
  - No file system issues
  - Easy querying and filtering
  
- ✅ **Cloudinary**: Perfect for images
  - Free tier: 25GB storage, 25GB bandwidth/month
  - Fast CDN delivery
  - Image transformations
  - Optimized for media

## Deployment Steps

### 1. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Start in **test mode** (for now)
   - Choose a location
4. Get Web App configuration:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Click Web icon (`</>`)
   - Register app and copy the config values

### 2. Set Up Cloudinary (for Images)

1. Sign up at [cloudinary.com](https://cloudinary.com) (free)
2. Get credentials from Dashboard → Settings:
   - Cloud Name
   - API Key  
   - API Secret
3. Create upload preset:
   - Settings → Upload → Upload presets
   - Add preset → Name: `ml_default`
   - Signing mode: **Unsigned**
   - Save

### 3. Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   ```
   ADMIN_PASSWORD_HASH=your_password_hash
   JWT_SECRET=your_random_secret_key
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Deploy!

### 4. Deploy to Netlify

1. Push your code to GitHub
2. Import project on [Netlify](https://netlify.com)
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables (same as Vercel)
5. Deploy!

## After Deployment

Once deployed:
- ✅ Edit posts through the admin panel (`/admin`)
- ✅ Upload images through the editor (stored in Cloudinary)
- ✅ Update profile information
- ✅ All changes saved instantly - no caching issues!
- ✅ Delete works immediately
