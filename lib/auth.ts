import bcrypt from 'bcryptjs'

export async function verifyPassword(password: string): Promise<boolean> {
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''
  const expectedPassword = '@Dangminhtrung123'

  // If no hash is set, use direct comparison (for first-time setup)
  if (!ADMIN_PASSWORD_HASH) {
    // Log the hash for setup purposes
    const hash = await bcrypt.hash(expectedPassword, 10)
    console.log('\n=== FIRST TIME SETUP ===')
    console.log('No ADMIN_PASSWORD_HASH found. Using direct comparison.')
    console.log('To use hashed password, add this to .env.local:')
    console.log(`ADMIN_PASSWORD_HASH=${hash}\n`)
    return password === expectedPassword
  }

  // If hash is set, compare using bcrypt
  try {
    const hashMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
    if (hashMatch) {
      return true
    }
    // If hash doesn't match, fallback to direct comparison (for development)
    // This helps if the hash was generated incorrectly
    const directMatch = password === expectedPassword
    if (directMatch) {
      console.log('\n⚠️  Hash mismatch detected. Using direct comparison.')
      console.log('Please regenerate your password hash using: npm run setup\n')
    }
    return directMatch
  } catch (error) {
    console.error('Error comparing password:', error)
    // Fallback to direct comparison if bcrypt fails
    return password === expectedPassword
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

