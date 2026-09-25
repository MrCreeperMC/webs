import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload, X, Image, Video, FileText, ArrowLeft, Save } from 'lucide-react'
import { contentService } from '../services/contentService'
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
  authorName: string
}

const INITIAL: FormData = {
  title: '',
  description: '',
  category: '',
  tags: '',
  mediaType: 'none',
  mediaUrl: '',
  mediaCaption: '',
  authorName: '',
}

export default function CreatePost({ editMode = false }: { editMode?: boolean }) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [form, setForm] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [saving, setSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useState(() => {
    if (editMode && id) {
      contentService.getPost(id).then((post) => {
        if (post) {
          setForm({
            title: post.title,
            description: post.description,
            category: post.category,
            tags: post.tags.join(', '),
            mediaType: post.mediaType === 'none' ? 'none' : (post.mediaType as 'image' | 'video'),
            mediaUrl: post.media?.url || '',
            mediaCaption: post.mediaCaption || post.media?.caption || '',
            authorName: post.author.name,
          })
          if (post.media?.url) setPreviewUrl(post.media.url)
        }
      })
    }
  })

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (form.title.length > 200) errs.title = 'Title must be under 200 characters'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (!form.category) errs.category = 'Select a category'
    if (!form.authorName.trim()) errs.authorName = 'Author name is required'
    if (form.mediaUrl && !isValidUrl(form.mediaUrl)) errs.mediaUrl = 'Enter a valid URL'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)

    const postData: Omit<Post, 'id' | 'createdAt' | 'views' | 'comments'> = {
      title: form.title.trim(),
      description: form.description.trim(),
      author: { name: form.authorName.trim() },
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      mediaType: form.mediaType,
      mediaCaption: form.mediaCaption.trim() || undefined,
      media: form.mediaUrl
        ? {
            type: form.mediaType === 'video' ? 'video' : 'image',
            url: form.mediaUrl,
            alt: form.title.trim(),
            caption: form.mediaCaption.trim() || undefined,
          }
        : undefined,
    }

    try {
      if (editMode && id) {
        await contentService.updatePost(id, postData)
        navigate(`/post/${id}`)
      } else {
        const newPost = await contentService.createPost(postData)
        navigate(`/post/${newPost.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setErrors((prev) => ({ ...prev, mediaUrl: 'Unsupported file type. Use an image or video.' }))
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    set('mediaUrl', url)
    set('mediaType', file.type.startsWith('video/') ? 'video' : 'image')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const removePreview = () => {
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

      {!editMode && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 text-sm text-amber-800 dark:text-amber-300">
          <strong>Demo mode:</strong> Posts are saved to your browser's localStorage.
          Connect a backend (Supabase, Firebase) for persistent storage and real file uploads.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Title *</label>
          <input
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
          <label className="block text-sm font-medium mb-1.5">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Write your post content..."
            rows={6}
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm resize-y"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Author Name *</label>
          <input
            type="text"
            value={form.authorName}
            onChange={(e) => set('authorName', e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
          {errors.authorName && <p className="text-xs text-red-500 mt-1">{errors.authorName}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Category *</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="Comma-separated tags (e.g. react, typescript, web)"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
        </div>

        {/* Media URL */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Media URL (optional)</label>
          <input
            type="url"
            value={form.mediaUrl}
            onChange={(e) => { set('mediaUrl', e.target.value); if (previewUrl) setPreviewUrl(null) }}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
          {errors.mediaUrl && <p className="text-xs text-red-500 mt-1">{errors.mediaUrl}</p>}
        </div>

        {/* Drag & drop */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
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
                accept="image/*,video/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
            </label>
          </p>
          <p className="text-xs text-gray-400">Files are stored locally in your browser for this demo.</p>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="relative rounded-xl overflow-hidden animate-scale-in">
            {form.mediaType === 'video' ? (
              <video src={previewUrl} controls className="w-full max-h-64 object-cover" />
            ) : (
              <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-cover" />
            )}
            <button
              onClick={removePreview}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Remove media"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Media caption */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Media Caption</label>
          <input
            type="text"
            value={form.mediaCaption}
            onChange={(e) => set('mediaCaption', e.target.value)}
            placeholder="Optional caption for the media"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={saving}
            icon={editMode ? <Save className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          >
            {editMode ? 'Save Changes' : 'Publish Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function isValidUrl(str: string): boolean {
  try { new URL(str); return true } catch { return false }
}
