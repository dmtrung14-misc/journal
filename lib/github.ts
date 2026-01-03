/**
 * GitHub API integration for storing files in production
 * This allows writing files to your GitHub repository
 */

const GITHUB_OWNER = process.env.GITHUB_OWNER || ''
const GITHUB_REPO = process.env.GITHUB_REPO || ''
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

interface GitHubFile {
  path: string
  content: string
  message: string
  branch?: string
}

async function getFileSha(path: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      return data.sha
    }
    return null
  } catch (error) {
    console.error('Error getting file SHA:', error)
    return null
  }
}

export async function createOrUpdateFile(
  path: string,
  content: string,
  message: string
): Promise<boolean> {
  if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
    console.error('GitHub credentials not configured')
    return false
  }

  try {
    const sha = await getFileSha(path)
    const base64Content = Buffer.from(content).toString('base64')

    const body: any = {
      message,
      content: base64Content,
      branch: 'main',
    }

    // If file exists, include SHA for update
    if (sha) {
      body.sha = sha
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('GitHub API error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error creating/updating file:', error)
    return false
  }
}

export async function deleteFile(path: string, message: string): Promise<boolean> {
  if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
    console.error('GitHub credentials not configured')
    return false
  }

  try {
    const sha = await getFileSha(path)
    if (!sha) {
      console.error('File not found')
      return false
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sha,
          branch: 'main',
        }),
      }
    )

    return response.ok
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

export function isGitHubEnabled(): boolean {
  return !!(GITHUB_OWNER && GITHUB_REPO && GITHUB_TOKEN)
}


