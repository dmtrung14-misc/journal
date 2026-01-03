# Production Deployment Guide

## ⚠️ Important: File System Limitations

On serverless platforms (Vercel, Netlify, etc.), the file system is **read-only** at runtime. This means:

- ✅ **Reading posts** - Works (files are read at build time)
- ❌ **Creating/editing posts** - Won't work (can't write to file system)
- ❌ **Uploading images** - Won't work (can't write to file system)
- ❌ **Updating profile** - Won't work (can't write to file system)

## Solutions

### Option 1: GitHub API (Recommended - Free)

Use GitHub API to commit files back to your repository. This keeps your files in version control and is free.

**Pros:**
- Free
- Files remain in your repo
- Version controlled
- Works with existing file structure

**Cons:**
- Requires GitHub token
- Slightly slower (API calls)

**Setup:**
1. Create a GitHub Personal Access Token with `repo` scope
2. Add to environment variables: `GITHUB_TOKEN=your_token`
3. Add `GITHUB_OWNER=your-username` and `GITHUB_REPO=journal`
4. Files will be committed to your repo automatically

### Option 2: Supabase (Free Database)

Use Supabase's free PostgreSQL database to store posts and profile data.

**Pros:**
- Free tier (500MB database)
- Fast
- Real-time capabilities

**Cons:**
- Need to migrate data structure
- Images still need separate storage

**Setup:**
1. Create account at supabase.com
2. Create a new project
3. Add connection string to environment variables

### Option 3: Hybrid Approach (Recommended for Production)

- **Content (Markdown files):** Use GitHub API for posts and profile JSON
- **Images:** Use Cloudinary free tier (25GB storage, 25GB bandwidth/month)

This gives you the best of both worlds:
- Text files stay in version control (GitHub)
- Images get CDN benefits and transformations (Cloudinary)
- Both are free

**Setup:**
1. Sign up at cloudinary.com (free)
2. Get your credentials from dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Create an unsigned upload preset (Settings → Upload → Upload presets)
4. Add to environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

**Note about storing markdown in Cloudinary:**
- Technically possible, but NOT recommended
- Cloudinary is optimized for media (images, videos)
- Markdown files don't benefit from image transformations/CDN
- GitHub is better for text files (version control, editing, free)
- Recommended: Use GitHub for markdown, Cloudinary for images only

## Current Status

The code currently uses file system writes. To deploy to production, you need to:

1. Implement one of the solutions above
2. Update the storage functions (`lib/posts.ts`, `lib/profile.ts`, `app/api/upload/route.ts`)
3. Add required environment variables

## Quick Fix for Now

For now, you can deploy and:
- ✅ **View posts** - Will work perfectly
- ❌ **Admin features** - Won't work in production until storage is updated

You can still edit locally and push changes to GitHub, which will trigger a rebuild.


