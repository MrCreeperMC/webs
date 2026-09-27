import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload, X, ArrowLeft, Save, FileText } from 'lucide-react'
import { contentService } from '../services/contentService'
import { uploadMedia } from '../services/mediaService'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { categories } from '../data/categories'
import { Button } from '../components/ui/Button'
import type { Post } from '../types/post'

interface FormData {
  title: string
  description: string
  category: string
  tags: string
  mediaType: 'image' | 'video' | 'none'
  mediaUrl: string
  mediaCaption: string
}

const INITIAL: FormData = {
  title: '',
  description: '',
  category: '',
  tags: '',
  mediaType: 'none',
  mediaUrl: '',
  mediaCaption: '',
}

const LOCAL_IMAGE_MAX = 1.5 * 1024 * 1024

export default function CreatePost({ editMode = false }: { editMode?: boolean }) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { profile } = useAuth()
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'form', string>>>({})
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (editMode && id) {
      contentService.getPost(id).then((post) => {
        if (post) {
          setForm({
            title: post.title,
            description: post.description,
            category: post.category,
            tags: post.tags.join(', '),
            mediaType: post.mediaType === 'none' ? 'none' : post.mediaType,
            mediaUrl: post.media?.url ?? '',
            mediaCaption: post.mediaCaption ?? post.media?.caption ?? '',
          })
          if (post.media?.url) setPreviewUrl(post.media.url)
        }
      })
    }
  }, [editMode, id])

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData | 'form', string>> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (form.title.length > 200) errs.title = 'Title must be under 200 characters'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (!form.category) errs.category = 'Select a category'
    if (form.mediaUrl && !isValidUrl(form.mediaUrl)) {
      errs.mediaUrl = 'Enter a valid URL (must start with http/https)'
    }
    if (form.mediaCaption && form.mediaType === 'none' && !form.mediaUrl) {
      errs.mediaCaption = 'Add media first, or remove the caption'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setErrors((prev) => ({ ...prev, form: undefined }))

    try {
      let mediaUrl = form.mediaUrl.trim()
      let mediaType: Post['mediaType'] = form.mediaType

      // A newly selected file takes precedence over any URL.
      if (selectedFile) {
        if (isSupabaseConfigured) {
          setUploading(true)
          const uploaded = await uploadMedia(selectedFile)
          mediaUrl = uploaded.url
          mediaType = uploaded.type
          setUploading(false)
        } else if (selectedFile.type.startsWith('image/') && selectedFile.size <= LOCAL_IMAGE_MAX) {
          mediaUrl = await fileToDataUrl(selectedFile)
          mediaType = 'image'
        } else {
          throw new Error(
            'Persistent uploads need the Supabase backend connected. Locally only images up to 1.5 MB are supported.'
          )
        }
      } else if (mediaUrl) {
        mediaType = inferType(mediaUrl, form.mediaType)
      } else {
        mediaType = 'none'
      }

      const postData: Omit<Post, 'id' | 'createdAt' | 'views' | 'comments'> = {
        title: form.title.trim(),
        description: form.description.trim(),
        author: { name: profile?.displayName ?? 'Unknown' },
        authorId: profile?.id,
        category: form.category,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        mediaType,
        mediaCaption: form.mediaCaption.trim() || undefined,
        media:
          mediaUrl && mediaType !== 'none'
            ? {
                type: mediaType,
                url: mediaUrl,
                alt: form.title.trim(),
                caption: form.mediaCaption.trim() || undefined,
              }
            : undefined,
      }

      if (editMode && id) {
        await contentService.updatePost(id, postData)
        navigate(`/post/${id}`)
      } else {
        const newPost = await contentService.createPost(postData)
        navigate(`/post/${newPost.id}`)
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err instanceof Error ? err.message : 'Failed to save the post.',
      }))
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleFile = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) {
      setErrors((prev) => ({
        ...prev,
        mediaUrl: 'Unsupported file type. Use an image (JPEG/PNG/GIF/WebP) or video (MP4/WebM).',
      }))
      return
    }
    if (isSupabaseConfigured) {
      if (file.size > 50 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, mediaUrl: 'File is too large. Maximum size is 50 MB.' }))
        return
      }
    } else if (!isImage || file.size > LOCAL_IMAGE_MAX) {
      setErrors((prev) => ({
        ...prev,
        mediaUrl: 'Connecting Supabase enables uploads of videos and larger files.',
      }))
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    set('mediaType', isVideo ? 'video' : 'image')
    set('mediaUrl', '')
    setErrors((prev) => ({ ...prev, mediaUrl: undefined }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const removePreview = () => {
    if (selectedFile) URL.revokeObjectURL(previewUrl ?? '')
    setSelectedFile(null)
    setPreviewUrl(null)
    set('mediaUrl', '')
    set('mediaType', 'none')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-3xl font-bold mb-2">{editMode ? 'Edit Post' : 'Create Post'}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {editMode ? 'Update your post details.' : 'Share something with the community.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="post-title" className="block text-sm font-medium mb-1.5">
            Title *
          </label>
          <input
            id="post-title"
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Enter a compelling title"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            maxLength={200}
          />
          <div className="flex justify-between mt-1">
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            <p className="text-xs text-gray-400 ml-auto">{form.title.length}/200</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="post-description" className="block text-sm font-medium mb-1.5">
            Description *
          </label>
          <textarea
            id="post-description"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Write your post content..."
            rows={6}
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm resize-y"
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="post-category" className="block text-sm font-medium mb-1.5">
            Category *
          </label>
          <select
            id="post-category"
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="post-tags" className="block text-sm font-medium mb-1.5">
            Tags
          </label>
          <input
            id="post-tags"
            type="text"
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="Comma-separated tags (e.g. react, typescript, web)"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
        </div>

        {/* Media URL */}
        <div>
          <label htmlFor="post-media-url" className="block text-sm font-medium mb-1.5">
            Media URL (optional)
          </label>
          <input
            id="post-media-url"
            type="url"
            value={form.mediaUrl}
            onChange={(e) => {
              set('mediaUrl', e.target.value)
              if (previewUrl && !selectedFile) setPreviewUrl(null)
            }}
            placeholder="https://example.com/image.jpg"
            disabled={Boolean(selectedFile)}
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm disabled:opacity-50"
          />
          {errors.mediaUrl && <p className="text-xs text-red-500 mt-1">{errors.mediaUrl}</p>}
        </div>

        {/* Drag & drop */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver
              ? 'border-accent bg-accent/5'
              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-500 mb-2">
            Drag & drop an image or video, or{' '}
            <label className="text-accent cursor-pointer hover:underline">
              browse
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/gif,image/webp,image/avif,video/mp4,video/webm"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                  e.target.value = ''
                }}
              />
            </label>
          </p>
          <p className="text-xs text-gray-400">
            {isSupabaseConfigured
              ? 'Files are uploaded to permanent cloud storage. Max 50 MB.'
              : 'Connect Supabase for permanent uploads. Local mode supports images up to 1.5 MB.'}
          </p>
        </div>

        {/* Preview */}
        {(previewUrl || form.mediaUrl) && !selectedFile && form.mediaUrl && (
          <MediaPreview url={form.mediaUrl} type={form.mediaType} onRemove={removePreview} />
        )}
        {selectedFile && previewUrl && (
          <MediaPreview url={previewUrl} type={form.mediaType} onRemove={removePreview} />
        )}

        {/* Media caption */}
        <div>
          <label htmlFor="post-caption" className="block text-sm font-medium mb-1.5">
            Media caption
          </label>
          <input
            id="post-caption"
            type="text"
            value={form.mediaCaption}
            onChange={(e) => set('mediaCaption', e.target.value)}
            placeholder="Optional caption shown under the media"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            maxLength={300}
          />
          {errors.mediaCaption && (
            <p className="text-xs text-red-500 mt-1">{errors.mediaCaption}</p>
          )}
        </div>

        {errors.form && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg px-3 py-2">
            {errors.form}
          </p>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={saving || uploading}
            icon={editMode ? <Save className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          >
            {uploading ? 'Uploading…' : editMode ? 'Save Changes' : 'Publish Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function MediaPreview({
  url,
  type,
  onRemove,
}: {
  url: string
  type: 'image' | 'video' | 'none'
  onRemove: () => void
}) {
  return (
    <div className="relative rounded-xl overflow-hidden animate-scale-in">
      {type === 'video' ? (
        <video src={url} controls className="w-full max-h-64 object-cover" />
      ) : (
        <img src={url} alt="Preview" className="w-full max-h-64 object-cover" />
      )}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label="Remove media"
        type="button"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.readAsDataURL(file)
  })
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function inferType(url: string, fallback: 'image' | 'video' | 'none'): 'image' | 'video' | 'none' {
  if (/\.mp4|\.webm|\.mov/i.test(url)) return 'video'
  if (/\.jpe?g|\.png|\.gif|\.webp|\.avif|\.svg|\.webp/i.test(url)) return 'image'
  return fallback
}
