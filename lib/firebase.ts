/**
 * Firebase Firestore integration for storing posts and profile data
 * Free tier: 50K reads/day, 20K writes/day, 20K deletes/day
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || ''
const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN || ''
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || ''
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || ''
const FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID || ''
const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID || ''

let app: FirebaseApp | null = null
let db: Firestore | null = null

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
}

export function getFirebaseApp(): FirebaseApp {
  if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) {
    throw new Error('Firebase credentials not configured')
  }

  if (app) {
    return app
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  return app
}

export function getFirestoreDB(): Firestore {
  if (!db) {
    getFirebaseApp()
    db = getFirestore(app!)
  }
  return db
}

export function isFirebaseEnabled(): boolean {
  return !!(
    FIREBASE_API_KEY &&
    FIREBASE_PROJECT_ID &&
    FIREBASE_APP_ID
  )
}
