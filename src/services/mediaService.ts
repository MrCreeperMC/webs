import { supabase, POST_MEDIA_BUCKET } from '../lib/supabase'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]

export type UploadResult = { url: string; type: 'image' | 'video' }

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Unsupported file type. Use JPEG, PNG, GIF, WebP, MP4 or WebM.'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File is too large. Maximum size is 50 MB.'
  }
  return null
}

function extensionFor(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName
  if (file.type === 'image/jpeg') return 'jpg'
  if (file.type === 'image/png') return 'png'
  if (file.type === 'video/mp4') return 'mp4'
  if (file.type === 'video/webm') return 'webm'
  return 'bin'
}

export async function uploadMedia(file: File): Promise<UploadResult> {
  const validationError = validateFile(file)
  if (validationError) throw new Error(validationError)

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(file)}`
  const { error } = await supabase.storage.from(POST_MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from(POST_MEDIA_BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, type: file.type.startsWith('video/') ? 'video' : 'image' }
}
