import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { stripMarkdown } from './markdown'
import { createOrUpdateFile, deleteFile, isGitHubEnabled } from './github'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'))
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    if (!fs.existsSync(fullPath)) {
      return null
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8')
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

export function getPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug.replace(/\.md$/, '')))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  return posts
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

  // Use GitHub API in production, file system in development
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
  const filePath = `content/posts/${slug}.md`

  // Use GitHub API in production, file system in development
  if (isGitHubEnabled()) {
    const success = await deleteFile(filePath, `Delete post: ${slug}`)
    if (!success) {
      throw new Error('Failed to delete post via GitHub API')
    }
  } else {
    // Local file system (development)
    const localPath = path.join(postsDirectory, `${slug}.md`)
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath)
    }
  }
}

