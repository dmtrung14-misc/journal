'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import PostEditor from './PostEditor'
import PostList from './PostList'
import ProfileEditor from './ProfileEditor'

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([])
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      toast.error('Failed to fetch posts')
    }
  }

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' })
    if (res.ok) {
      toast.success('Logged out successfully')
      router.push('/')
      router.refresh()
    }
  }

  const handleCreateNew = () => {
    setSelectedPost(null)
    setShowEditor(true)
  }

  const handleEdit = (slug: string) => {
    setSelectedPost(slug)
    setShowEditor(true)
  }

  const handleSave = () => {
    setShowEditor(false)
    setSelectedPost(null)
    fetchPosts()
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Post deleted successfully')
        fetchPosts()
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  if (showEditor) {
    return (
      <PostEditor
        slug={selectedPost}
        onSave={handleSave}
        onCancel={() => {
          setShowEditor(false)
          setSelectedPost(null)
        }}
      />
    )
  }

  if (showProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
              <button
                onClick={() => setShowProfile(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfileEditor />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="font-medium-logo text-2xl text-black hover:text-black">dmtrung14's WriterPad</h1>
            <div className="flex gap-4">
              <a
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View Blog
              </a>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex gap-4">
          <button
            onClick={handleCreateNew}
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
          >
            + Create New Post
          </button>
          <button
            onClick={() => setShowProfile(true)}
            className="bg-white text-gray-700 px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
          >
            Edit Profile
          </button>
        </div>

        <PostList
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}

