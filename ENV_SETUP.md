# Environment Variables Setup Guide

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Generate auth secrets:**
   ```bash
   npm run setup
   ```
   This outputs `ADMIN_PASSWORD_HASH` and `JWT_SECRET` - copy them to `.env.local`

3. **Set up Firebase and Cloudinary:**
   - See Firebase setup below
   - See Cloudinary setup below

4. **Add all variables to `.env.local`**

## Firebase Setup (Required)

Firebase Firestore stores posts and profile data. Free tier includes 50K reads/day, 20K writes/day.

### Step 1: Create Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or select existing project
3. Follow the setup wizard

### Step 2: Enable Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (we'll set up security rules later if needed)
4. Choose a location (pick closest to you)
5. Click "Enable"

### Step 3: Get Web App Configuration

1. Go to **Project Settings** (gear icon) → **General** tab
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app (nickname: "Journal" or any name)
5. Copy the Firebase configuration object

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### Step 4: Add to Environment Variables

**For local development (`.env.local`):**
```env
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123...
```

**For production (Vercel/Netlify dashboard):**
1. Go to your project → Settings → Environment Variables
2. Add each variable (same format as above)
3. Select environment (Production, Preview, Development)
4. Save

## Cloudinary Setup (Required for Images)

Cloudinary is used only for image uploads. Free tier includes 25GB storage and 25GB bandwidth/month.

### Step 1: Create Account

1. Sign up at [cloudinary.com](https://cloudinary.com) (free)
2. Verify your email

### Step 2: Get Credentials

1. Go to Dashboard
2. Find your credentials in the top section:
   - **Cloud Name** (e.g., `dxyz1234`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Reveal" to see it)

### Step 3: Create Upload Preset

1. Go to **Settings** → **Upload** → **Upload presets**
2. Click **Add upload preset**
3. Configure:
   - **Preset name:** `ml_default`
   - **Signing mode:** **Unsigned** (important!)
   - **Folder:** `journal` (optional)
   - **Resource type:** **Image**
4. Click **Save**

### Step 4: Add to Environment Variables

**For local development (`.env.local`):**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**For production (Vercel dashboard):**
1. Go to your project → Settings → Environment Variables
2. Add each variable
3. Select environment (Production, Preview, Development)
4. Save

## Storage Locations

- **Posts:** Firestore collection `posts`
- **Profile:** Firestore collection `profile` (document `default`)
- **Images:** Cloudinary folder `journal/`

## How It Works

- **All data storage:** Firebase Firestore (no file system needed)
- **All images:** Cloudinary (optimized CDN delivery)
- **No fallbacks:** This setup works the same in development and production
