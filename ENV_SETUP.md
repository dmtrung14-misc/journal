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

3. **For local development:**
   - Just set `ADMIN_PASSWORD_HASH` and `JWT_SECRET`
   - Leave Cloudinary empty (uses local file system)
   - Files are saved to `/content/posts/` and `/public/images/`

4. **For production (Vercel/Netlify):**
   - Set ALL variables in your hosting platform's dashboard
   - Cloudinary is **required** for production (file system is read-only)
   - See Cloudinary setup below

## Cloudinary Setup (Required for Production)

Cloudinary is used to store both markdown files and images. Free tier includes 25GB storage and 25GB bandwidth/month.

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
   - **Folder:** Leave empty (we set it in code)
   - **Resource type:** **Auto** or **Raw** (works for both images and text)
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
2. Add each variable:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Select environment (Production, Preview, Development)
4. Save

## How It Works

- **Local Development:** If Cloudinary is not configured, files are saved to local file system
- **Production:** Cloudinary is required (file system is read-only on serverless platforms)
- Files are automatically detected and stored/retrieved from the appropriate location

## Storage Locations

- **Markdown files:** `journal/posts/` folder in Cloudinary
- **Images:** `journal/` folder in Cloudinary (or local `/public/images/` in development)
- **Profile data:** `journal/profile.json` in Cloudinary (or local `/content/profile.json` in development)
