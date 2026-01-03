# Production Deployment Guide

## Storage: Cloudinary Only

This application uses **Cloudinary** as the storage backend for production. Cloudinary stores:
- Markdown files (blog posts)
- Images
- Profile data

**Free tier:** 25GB storage, 25GB bandwidth/month

## Why Cloudinary?

- ✅ Edit posts directly in web UI (no git needed!)
- ✅ All files (markdown + images) in one place
- ✅ Free tier is generous (25GB storage)
- ✅ Fast CDN delivery for images
- ✅ No version control complexity

## Deployment Steps

### 1. Set Up Cloudinary

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

### 2. Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   ```
   ADMIN_PASSWORD_HASH=your_password_hash
   JWT_SECRET=your_random_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Deploy!

### 3. Deploy to Netlify

1. Push your code to GitHub
2. Import project on [Netlify](https://netlify.com)
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables (same as Vercel)
5. Deploy!

## Local Development

For local development, you can:
- Use Cloudinary (same as production) - recommended
- Or leave Cloudinary empty to use local file system

Files are automatically saved to the appropriate location based on configuration.

## File System Limitations

On serverless platforms (Vercel, Netlify), the file system is **read-only** at runtime:
- ❌ Can't write files directly
- ✅ Cloudinary handles all file storage
- ✅ Works seamlessly with the admin panel

## After Deployment

Once deployed:
- ✅ Edit posts through the admin panel (`/admin`)
- ✅ Upload images through the editor
- ✅ Update profile information
- ✅ All changes saved to Cloudinary instantly
- ✅ No git operations needed!
