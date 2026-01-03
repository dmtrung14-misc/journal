/**
 * Cloudinary integration for image storage
 * Free tier: 25GB storage, 25GB bandwidth/month
 */

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || ''
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || ''

export interface CloudinaryUploadResult {
  url: string
  public_id: string
  secure_url: string
}

export async function uploadToCloudinary(
  file: Buffer,
  filename: string,
  folder?: string
): Promise<CloudinaryUploadResult> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials not configured')
  }

  // Convert buffer to base64 for text files (markdown)
  // For images, use data URI with proper mime type
  const isImage = filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  const mimeType = isImage ? `image/${filename.split('.').pop()}` : 'text/plain'
  const base64File = file.toString('base64')
  const dataUri = `data:${mimeType};base64,${base64File}`

  // Build form data
  const formData = new URLSearchParams()
  formData.append('file', dataUri)
  formData.append('upload_preset', 'ml_default') // Unsigned upload preset
  formData.append('resource_type', isImage ? 'image' : 'raw') // raw for text files
  if (folder) {
    formData.append('folder', folder)
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${isImage ? 'image' : 'raw'}/upload`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Cloudinary upload failed: ${error}`)
  }

  const data = await response.json()
  return {
    url: data.secure_url,
    public_id: data.public_id,
    secure_url: data.secure_url,
  }
}

export async function getFileFromCloudinary(publicId: string): Promise<string | null> {
  if (!isCloudinaryEnabled()) {
    return null
  }

  try {
    // Cloudinary raw files are publicly accessible via URL
    const response = await fetch(
      `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}`
    )

    if (response.ok) {
      return await response.text()
    }
    return null
  } catch (error) {
    console.error('Error fetching file from Cloudinary:', error)
    return null
  }
}

export async function listFilesFromCloudinary(folder: string): Promise<string[]> {
  if (!isCloudinaryEnabled()) {
    return []
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const crypto = require('crypto')
    const signature = crypto
      .createHash('sha1')
      .update(`expression=folder:${folder}${timestamp}${CLOUDINARY_API_SECRET}`)
      .digest('hex')

    const params = new URLSearchParams({
      expression: `folder:${folder}`,
      max_results: '500',
      timestamp: timestamp.toString(),
      signature,
      api_key: CLOUDINARY_API_KEY,
    })

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/search?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      return (
        data.resources
          ?.filter((r: any) => r.resource_type === 'raw')
          .map((r: any) => r.public_id.replace(`${folder}/`, '').replace(/\.md$/, '')) || []
      )
    }
    return []
  } catch (error) {
    console.error('Error listing files from Cloudinary:', error)
    return []
  }
}

export async function deleteFileFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryEnabled()) {
    return false
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const crypto = require('crypto')
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
      .digest('hex')

    const formData = new URLSearchParams()
    formData.append('public_id', publicId)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('api_key', CLOUDINARY_API_KEY)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/raw/upload`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      }
    )

    return response.ok
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error)
    return false
  }
}

export function isCloudinaryEnabled(): boolean {
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET)
}

