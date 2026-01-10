import matter from 'gray-matter'
import { stripMarkdown } from './markdown'
import { getFirestoreDB, isFirebaseEnabled } from './firebase'
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore'

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export async function getPostSlugs(): Promise<string[]> {
  if (!isFirebaseEnabled()) {
    console.warn('Firebase is not configured - returning empty post list')
    return [] // Return empty array if Firebase not configured (for build time)
  }

  try {
    const db = getFirestoreDB()
    const snapshot = await getDocs(collection(db, 'posts'))
    console.log(`Fetched ${snapshot.docs.length} posts from Firebase`)
    return snapshot.docs.map((doc) => doc.id)
  } catch (error: any) {
    console.error('Error fetching post slugs from Firebase:', error)
    console.error('Error code:', error?.code)
    console.error('Error message:', error?.message)
    // If it's a permission error, log it prominently
    if (error?.code === 'permission-denied') {
      console.error('PERMISSION DENIED: Check your Firestore security rules! Posts collection must allow read access.')
    }
    return [] // Return empty array on error (for build time)
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase is not configured')
  }

  try {
    const db = getFirestoreDB()
    const docRef = doc(db, 'posts', slug)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    const data = docSnap.data()
    if (!data) {
      return null
    }

    // Parse the content (stored as markdown with front matter)
    const { data: frontMatter, content } = matter(data.content || '')

    // Strip markdown from excerpt for preview
    const rawExcerpt = frontMatter.excerpt || content.substring(0, 200)
    const plainTextExcerpt = stripMarkdown(rawExcerpt)
    const finalExcerpt = plainTextExcerpt.length > 150 
      ? plainTextExcerpt.substring(0, 150) + '...'
      : plainTextExcerpt

    return {
      slug,
      title: frontMatter.title || data.title || 'Untitled',
      date: frontMatter.date || data.date || new Date().toISOString(),
      excerpt: finalExcerpt,
      content,
    }
  } catch (error: any) {
    console.error('Error fetching post from Firebase:', error)
    console.error('Error code:', error?.code)
    console.error('Error message:', error?.message)
    // If it's a permission error, log it prominently
    if (error?.code === 'permission-denied') {
      console.error('PERMISSION DENIED: Check your Firestore security rules! Posts collection must allow read access.')
    }
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
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase is not configured')
  }

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

  // Store as markdown with front matter (same format as before)
  const fileContent = matter.stringify(content, frontMatter)

  try {
    const db = getFirestoreDB()
    const docRef = doc(db, 'posts', slug)
    await setDoc(docRef, {
      title,
      date: new Date().toISOString(),
      excerpt: finalExcerpt,
      content: fileContent, // Store full markdown with front matter
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error('Error saving post to Firebase:', error)
    throw error
  }
}

export async function deletePost(slug: string): Promise<void> {
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase is not configured')
  }

  try {
    const db = getFirestoreDB()
    const docRef = doc(db, 'posts', slug)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting post from Firebase:', error)
    throw error
  }
}
