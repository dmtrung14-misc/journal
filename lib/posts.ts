import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { stripMarkdown } from './markdown'
import {
  uploadToCloudinary,
  getFileFromCloudinary,
  listFilesFromCloudinary,
  deleteFileFromCloudinary,
  isCloudinaryEnabled,
} from './cloudinary'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export async function getPostSlugs(): Promise<string[]> {
  // Use Cloudinary if enabled, otherwise file system (local dev)
  if (isCloudinaryEnabled()) {
    try {
      const slugs = await listFilesFromCloudinary('journal/posts')
      return slugs
    } catch (error) {
      console.error('Error fetching posts from Cloudinary:', error)
      return []
    }
  }

  // Fallback to file system (local development only)
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }
  return fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  let fileContents: string | null = null

  // Try Cloudinary first
  if (isCloudinaryEnabled()) {
    try {
      fileContents = await getFileFromCloudinary(`journal/posts/${slug}`)
    } catch (error) {
      console.error('Error fetching post from Cloudinary:', error)
    }
  }

  // Fallback to file system
  if (!fileContents) {
    try {
      const fullPath = path.join(postsDirectory, `${slug}.md`)
      if (!fs.existsSync(fullPath)) {
        return null
      }
      fileContents = fs.readFileSync(fullPath, 'utf8')
    } catch (error) {
      console.error('Error reading post from file system:', error)
      return null
    }
  }

  try {
    const { data, content } = matter(fileContents)

    // Strip markdown from excerpt for preview
    const rawExcerpt = data.excerpt || content.substring(0, 200)
    const plainTextExcerpt = stripMarkdown(rawExcerpt)
    const finalExcerpt = plainTextExcerpt.length > 150 
      ? plainTextExcerpt.substring(0, 150) + '...'
      : plainTextExcerpt

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      excerpt: finalExcerpt,
      content,
    }
  } catch (error) {
    console.error('Error reading post:', error)
    return null
  }
}

export async function getPosts(): Promise<Post[]> {
  const slugs = await getPostSlugs()
  const posts = await Promise.all(
    slugs.map((slug) => getPostBySlug(slug))
  )
  return posts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
}

export async function savePost(slug: string, title: string, content: string, excerpt?: string): Promise<void> {
  // Strip markdown from excerpt if provided
  const rawExcerpt = excerpt || content.substring(0, 200)
  const plainTextExcerpt = stripMarkdown(rawExcerpt)
  const finalExcerpt = plainTextExcerpt.length > 150 
    ? plainTextExcerpt.substring(0, 150) + '...'
    : plainTextExcerpt

  const frontMatter = {
    title,
    date: new Date().toISOString(),
    excerpt: finalExcerpt,
  }

  const fileContent = matter.stringify(content, frontMatter)
  const filePath = `content/posts/${slug}.md`

  // Try Cloudinary first (if enabled)
  if (isCloudinaryEnabled()) {
    try {
      const buffer = Buffer.from(fileContent, 'utf8')
      const result = await uploadToCloudinary(buffer, `${slug}.md`, 'journal/posts')
      // Store successfully in Cloudinary
      return
    } catch (error) {
      console.error('Error saving to Cloudinary, falling back:', error)
      // Fall through to GitHub/file system
    }
  }

  // Use GitHub API if enabled
  if (isGitHubEnabled()) {
    const success = await createOrUpdateFile(
      filePath,
      fileContent,
      `Update post: ${title}`
    )
    if (!success) {
      throw new Error('Failed to save post via GitHub API')
    }
  } else {
    // Local file system (development)
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }
    const localPath = path.join(postsDirectory, `${slug}.md`)
    fs.writeFileSync(localPath, fileContent, 'utf8')
  }
}

export async function deletePost(slug: string): Promise<void> {
  // Use Cloudinary in production, file system in local development
  if (isCloudinaryEnabled()) {
    await deleteFileFromCloudinary(`journal/posts/${slug}`)
  } else {
    // Local file system (development only)
    const localPath = path.join(postsDirectory, `${slug}.md`)
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath)
    }
  }
}

