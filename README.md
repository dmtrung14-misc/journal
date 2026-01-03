# Personal Journal - Medium Clone

A personal blog platform where anyone can read posts, but only you (the admin) can create and edit them.

## Features

- 📝 Rich text formatting with Markdown
- 💻 Code syntax highlighting with Prism.js
- 🧮 LaTeX math support with KaTeX
- 🖼️ Image uploads and support
- 🔒 Password-protected admin panel
- 📱 Responsive design
- 🚀 Free hosting ready (Vercel/Netlify)

## Storage Strategy

### Production: Cloudinary
- **All files stored in Cloudinary** (markdown posts, images, profile data)
- Free tier: 25GB storage, 25GB bandwidth/month
- Edit posts directly in web UI - no git needed!
- Fast CDN delivery for images
- See `DEPLOYMENT.md` for setup

### Local Development
- Files saved to local file system (`/content/posts/`, `/public/images/`)
- Or use Cloudinary (same as production) - just add credentials to `.env.local`

### Authentication
- Password hash stored in environment variable `ADMIN_PASSWORD_HASH`
- JWT tokens for session management
- Secure and production-ready

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate password hash:**
   ```bash
   npm run setup
   ```
   This will generate the password hash and JWT secret for you.

3. **Create `.env.local` file:**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   ```
   
   Then fill in the values:
   - Run `npm run setup` to generate `ADMIN_PASSWORD_HASH` and `JWT_SECRET`
   - Add the generated values to `.env.local`
   - For local development, you can leave Cloudinary empty (uses file system)
   - For production, Cloudinary is required - see `DEPLOYMENT.md` for setup

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Admin Access

- Go to `/admin` to access the admin panel
- Default password: `@Dangminhtrung123` (change this in production!)
- Only authenticated users can create/edit/delete posts
- Anyone can read published posts

## Writing Posts

Posts support:
- **Markdown** for text formatting
- **Code blocks** with syntax highlighting (use \`\`\`language)
- **LaTeX math** (inline: `$formula$`, block: `$$formula$$`)
- **Images** (upload via the editor or use markdown: `![alt](url)`)

## Deployment

**Cloudinary is required for production** - see `DEPLOYMENT.md` for detailed setup instructions.

### Quick Steps:
1. Set up Cloudinary account (free)
2. Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
3. Add environment variables (see `DEPLOYMENT.md`)
4. Deploy!

All files (posts, images, profile) are stored in Cloudinary - no git operations needed!

## Security Notes

- Change the default password in production
- Use a strong `JWT_SECRET` in production
- Keep your Cloudinary API secret secure
- Files are backed up in Cloudinary automatically

## License

MIT

