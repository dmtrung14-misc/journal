'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'

interface Profile {
  username: string
  fullName: string
  description: string
  profilePic: string
  banner: string
}

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Profile>({
    username: '',
    fullName: '',
    description: '',
    profilePic: '',
    banner: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (res.ok) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (field: 'profilePic' | 'banner') => (url: string) => {
    setProfile((prev) => ({ ...prev, [field]: url }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={profile.fullName}
          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={profile.description}
          onChange={(e) => setProfile({ ...profile, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture
        </label>
        {profile.profilePic && (
          <div className="mb-2">
            <img
              src={profile.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}
        <ImageUpload onUpload={handleImageUpload('profilePic')} />
        {profile.profilePic && (
          <input
            type="text"
            value={profile.profilePic}
            onChange={(e) => setProfile({ ...profile, profilePic: e.target.value })}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Or enter image URL"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banner Image
        </label>
        {profile.banner && (
          <div className="mb-2">
            <img
              src={profile.banner}
              alt="Banner"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        <ImageUpload onUpload={handleImageUpload('banner')} />
        {profile.banner && (
          <input
            type="text"
            value={profile.banner}
            onChange={(e) => setProfile({ ...profile, banner: e.target.value })}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Or enter image URL"
          />
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}

