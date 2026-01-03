import fs from 'fs'
import path from 'path'
import {
  uploadToCloudinary,
  getFileFromCloudinary,
  isCloudinaryEnabled,
} from './cloudinary'

const profilePath = path.join(process.cwd(), 'content', 'profile.json')

export interface Profile {
  username: string
  fullName: string
  description: string
  profilePic: string
  banner: string
  followers: number
  following: number
}

const defaultProfile: Profile = {
  username: 'dmtrung14',
  fullName: 'Dang Minh Trung',
  description: 'Welcome to my journal. Thoughts, ideas, and stories.',
  profilePic: '/images/profile_pics.png',
  banner: '',
  followers: 0,
  following: 0,
}

export async function getProfile(): Promise<Profile> {
  // Try Cloudinary first
  if (isCloudinaryEnabled()) {
    try {
      const content = await getFileFromCloudinary('journal/profile.json')
      if (content) {
        return { ...defaultProfile, ...JSON.parse(content) }
      }
    } catch (error) {
      console.error('Error reading profile from Cloudinary:', error)
    }
  }

  // Fallback to file system
  try {
    if (fs.existsSync(profilePath)) {
      const content = fs.readFileSync(profilePath, 'utf8')
      return { ...defaultProfile, ...JSON.parse(content) }
    }
  } catch (error) {
    console.error('Error reading profile:', error)
  }
  return defaultProfile
}

export async function saveProfile(profile: Partial<Profile>): Promise<void> {
  try {
    const currentProfile = await getProfile()
    const updatedProfile = { ...currentProfile, ...profile }
    const content = JSON.stringify(updatedProfile, null, 2)

    // Use Cloudinary in production, file system in local development
    if (isCloudinaryEnabled()) {
      const buffer = Buffer.from(content, 'utf8')
      await uploadToCloudinary(buffer, 'profile.json', 'journal')
    } else {
      // Local file system (development only)
      const dir = path.dirname(profilePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(profilePath, content, 'utf8')
    }
  } catch (error) {
    console.error('Error saving profile:', error)
    throw error
  }
}
