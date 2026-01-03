'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'

interface PostEditorProps {
  slug: string | null
  onSave: () => void
  onCancel: () => void
}

export default function PostEditor({ slug, onSave, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/posts/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setTitle(data.title)
        setContent(data.content)
        setExcerpt(data.excerpt || '')
      } else {
        toast.error('Failed to load post')
      }
    } catch (error) {
      toast.error('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!content.trim()) {
      toast.error('Content is required')
      return
    }

    setSaving(true)
    try {
      // When editing, keep the original slug. When creating new, generate from title
      const postSlug = slug || generateSlug(title)
      const res = await fetch(`/api/posts/${postSlug}`, {
        method: slug ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt,
        }),
      })

      if (res.ok) {
        toast.success('Post saved successfully!')
        onSave()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save post')
      }
    } catch (error) {
      toast.error('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  const insertImageMarkdown = (imageUrl: string, alt: string = '') => {
    const imageMarkdown = `![${alt}](${imageUrl})`
    const textarea = document.getElementById('content') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = content
      const before = text.substring(0, start)
      const after = text.substring(end)
      setContent(before + imageMarkdown + after)
      // Set cursor after inserted text
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + imageMarkdown.length,
          start + imageMarkdown.length
        )
      }, 0)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">
              {slug ? 'Edit Post' : 'Create New Post'}
            </h1>
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt (optional)
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the post"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Content (Markdown supported)
              </label>
              <ImageUpload onUpload={insertImageMarkdown} />
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="Write your post content here. Markdown is supported, including code blocks and LaTeX math."
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Markdown tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Code blocks: Use three backticks with language name
                  <code className="bg-gray-100 px-1 rounded">
                    {' ```javascript\ncode here\n``` '}
                  </code>
                </li>
                <li>
                  LaTeX: Use $ for inline math and $$ for block math
                  <code className="bg-gray-100 px-1 rounded">
                    {' $E = mc^2$ or $$\\int_0^1 x^2 dx$$'}
                  </code>
                </li>
                <li>
                  Images: Use ![alt text](image-url) or click the image button
                  above
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

