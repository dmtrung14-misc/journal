# Firestore Security Rules Guide

## Why Rules Are Needed

When your Next.js app runs in production (Vercel/Netlify), it makes requests to Firestore from the server. These requests are **unauthenticated** (no Firebase Auth), so Firestore security rules must explicitly allow read access.

## Required Rules

Copy these rules to Firebase Console → Firestore Database → Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to posts and profile
    match /posts/{postId} {
      allow read: if true;
      allow write: if false; // Writes are handled by your admin auth
    }
    match /profile/{profileId} {
      allow read: if true;
      allow write: if false; // Writes are handled by your admin auth
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## How to Update Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Paste the rules above
5. Click **"Publish"** (not just "Validate")
6. Wait a few seconds for rules to propagate

## Security Note

These rules allow **anyone** to read posts and profile, which is what you want for a public blog. Write access is blocked at the Firestore level, but your app uses its own admin authentication (password + JWT) to control writes via API routes.

## Verifying Rules Are Working

After publishing rules:
1. Check Vercel/Netlify deployment logs
2. Look for `permission-denied` errors (should be gone)
3. Visit your deployed site - posts should load
4. Check browser console for Firebase errors

## Test Mode vs. Production Rules

- **Test mode** (30 days): Allows all reads/writes temporarily
- **Production rules** (above): Allows reads, blocks public writes permanently

If you started in test mode, you must update to production rules before the 30-day period expires, or posts will stop loading!

