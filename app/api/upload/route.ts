import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { jwtVerify } from 'jose'
import { uploadToCloudinary, isCloudinaryEnabled } from '@/lib/cloudinary'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false

  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Use Cloudinary in production, local file system in development
    if (isCloudinaryEnabled()) {
      try {
        const result = await uploadToCloudinary(buffer, file.name, 'journal')
        return NextResponse.json({ url: result.secure_url })
      } catch (error) {
        console.error('Cloudinary upload error:', error)
        return NextResponse.json(
          { error: 'Failed to upload to Cloudinary' },
          { status: 500 }
        )
      }
    } else {
      // Local file system (development)
      const imagesDir = join(process.cwd(), 'public', 'images')
      const { mkdir } = await import('fs/promises')
      try {
        await mkdir(imagesDir, { recursive: true })
      } catch {
        // Directory already exists
      }

      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filename = `${timestamp}-${sanitizedName}`
      const filepath = join(imagesDir, filename)

      await writeFile(filepath, buffer)

      const url = `/images/${filename}`
      return NextResponse.json({ url })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

