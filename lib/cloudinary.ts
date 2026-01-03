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

  // Convert buffer to base64
  const base64File = file.toString('base64')
  const dataUri = `data:application/octet-stream;base64,${base64File}`

  // Build form data for multipart/form-data
  const formData = new URLSearchParams()
  formData.append('file', dataUri)
  formData.append('upload_preset', 'ml_default') // You'll need to create an unsigned upload preset
  if (folder) {
    formData.append('folder', folder)
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
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

export function isCloudinaryEnabled(): boolean {
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET)
}

