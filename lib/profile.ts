import { getFirestoreDB, isFirebaseEnabled } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

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
  fullName: 'Trung Dang',
  description: 'Random thoughts here. My technical blog is still at https://dmtrung.com/blogs',
  profilePic: '/images/profile_pics.png',
  banner: '',
  followers: 0,
  following: 0,
}

export async function getProfile(): Promise<Profile> {
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase is not configured')
  }

  try {
    const db = getFirestoreDB()
    const docRef = doc(db, 'profile', 'default')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists() && docSnap.data()) {
      return { ...defaultProfile, ...docSnap.data() } as Profile
    }

    // Create default profile if it doesn't exist
    await setDoc(docRef, defaultProfile)
    return defaultProfile
  } catch (error) {
    console.error('Error reading profile from Firebase:', error)
    return defaultProfile
  }
}

export async function saveProfile(profile: Partial<Profile>): Promise<void> {
  if (!isFirebaseEnabled()) {
    throw new Error('Firebase is not configured')
  }

  try {
    const currentProfile = await getProfile()
    const updatedProfile = { ...currentProfile, ...profile }

    const db = getFirestoreDB()
    const docRef = doc(db, 'profile', 'default')
    await setDoc(docRef, {
      ...updatedProfile,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error('Error saving profile to Firebase:', error)
    throw error
  }
}
