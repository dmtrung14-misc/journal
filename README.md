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

### Blog Posts
- Stored as Markdown files in `/content/posts/`
- Free, version-controlled, and easy to back up
- No database needed

### Password Authentication
- Password hash stored in environment variable `ADMIN_PASSWORD_HASH`
- JWT tokens for session management
- Secure and production-ready

### Images
- Stored locally in `/public/images/`
- Accessible via `/images/` URL path
- Can be migrated to Cloudinary or similar CDN later if needed

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
   ```env
   ADMIN_PASSWORD_HASH=<your-hashed-password>
   JWT_SECRET=<generate-a-random-secret-key>
   ```

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

## Deployment (Free Options)

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `ADMIN_PASSWORD_HASH` (your password hash)
   - `JWT_SECRET` (random secret key)
   - `GITHUB_TOKEN` (GitHub Personal Access Token with `repo` scope)
   - `GITHUB_OWNER` (your GitHub username OR organization name if repo is in an org)
   - `GITHUB_REPO` (repository name, e.g., `journal`)
   - `CLOUDINARY_CLOUD_NAME` (optional, for image uploads)
   - `CLOUDINARY_API_KEY` (optional, for image uploads)
   - `CLOUDINARY_API_SECRET` (optional, for image uploads)
4. Deploy!

**Note:** 
- For production writes (creating posts, updating profile), set up GitHub API
- For image uploads, set up Cloudinary (recommended) or use GitHub API
- See `DEPLOYMENT.md` for detailed setup instructions

### Netlify
1. Push your code to GitHub
2. Import project on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables
6. Deploy!

## Security Notes

- Change the default password in production
- Use a strong `JWT_SECRET` in production
- Consider using environment variables for all secrets
- Regular backups of `/content/posts/` directory

## License

MIT

