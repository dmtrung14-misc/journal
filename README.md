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

### Firebase Firestore + Cloudinary
- **Posts & Profile:** Firebase Firestore (free tier: 50K reads/day, 20K writes/day)
- **Images:** Cloudinary (free tier: 25GB storage, 25GB bandwidth/month)
- Edit posts directly in web UI - no git needed!
- Fast CDN delivery for images
- Real-time updates, no caching issues
- See `DEPLOYMENT.md` for setup

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
   - Set up Firebase (see `ENV_SETUP.md`) - required
   - Set up Cloudinary (see `ENV_SETUP.md`) - required for images

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

**Firebase and Cloudinary are required** - see `DEPLOYMENT.md` for detailed setup instructions.

### Quick Steps:
1. Set up Firebase Firestore (free)
2. Set up Cloudinary account (free, for images)
3. Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
4. Add environment variables (see `DEPLOYMENT.md`)
5. Deploy!

Posts and profile stored in Firebase, images in Cloudinary - no git operations needed!

## Security Notes

- Change the default password in production
- Use a strong `JWT_SECRET` in production
- Keep your Cloudinary API secret secure
- Files are backed up in Cloudinary automatically

## License

MIT

