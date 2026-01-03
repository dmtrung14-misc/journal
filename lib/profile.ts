import fs from 'fs'
import path from 'path'
import { createOrUpdateFile, isGitHubEnabled } from './github'

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

export function getProfile(): Profile {
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
    const currentProfile = getProfile()
    const updatedProfile = { ...currentProfile, ...profile }
    const content = JSON.stringify(updatedProfile, null, 2)

    // Use GitHub API in production, file system in development
    if (isGitHubEnabled()) {
      const success = await createOrUpdateFile(
        'content/profile.json',
        content,
        'Update profile'
      )
      if (!success) {
        throw new Error('Failed to save profile via GitHub API')
      }
    } else {
      // Local file system (development)
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

