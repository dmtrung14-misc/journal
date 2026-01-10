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
4. **CRITICAL: Configure Firestore Security Rules**
   - Go to Firestore Database → Rules tab
   - Replace the rules with this (allows public read, prevents public write):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow public read access to posts and profile
       match /posts/{postId} {
         allow read: if true;
         allow write: if false; // Writes are handled by your admin auth
       }
       match /profile/{profileId} {
         allow read: if true;
         allow write: if false; // Writes are handled by your admin auth
       }
       
       // Deny all other access
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
   - Click "Publish" to save the rules
   - **Important**: Without these rules, posts won't load in production!
5. Get Web App configuration:
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

## Troubleshooting

### Posts not showing in production but work locally?

**Most likely cause: Firestore Security Rules**

1. Check Vercel/Netlify logs for `permission-denied` errors
2. Verify your Firestore security rules allow public read access (see step 4 above)
3. Go to Firebase Console → Firestore Database → Rules
4. Make sure rules are published (not just saved)
5. Rules should allow `allow read: if true` for `posts` and `profile` collections

**Other common issues:**

- Environment variables not set in Vercel/Netlify dashboard
- Firestore database not created (only API enabled)
- Wrong Firebase project ID in environment variables
- Check browser console and server logs for detailed error messages

## After Deployment

Once deployed:
- ✅ Edit posts through the admin panel (`/admin`)
- ✅ Upload images through the editor (stored in Cloudinary)
- ✅ Update profile information
- ✅ All changes saved instantly - no caching issues!
- ✅ Delete works immediately
