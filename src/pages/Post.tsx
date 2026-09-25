import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Eye, MessageCircle, Tag, Trash2, Edit } from 'lucide-react'
import { contentService } from '../services/contentService'
import type { Post as PostType } from '../types/post'
import { MediaRenderer } from '../components/media/MediaRenderer'
import { PostCard } from '../components/posts/PostCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { categories } from '../data/categories'
import { storageService } from '../services/storageService'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} minutes ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} days ago`
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostType | null>(null)
  const [related, setRelated] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    async function load() {
      if (!id) return
      setLoading(true)
      const [found, rel] = await Promise.all([
        contentService.getPost(id),
        contentService.getRelatedPosts(id),
      ])
      setPost(found || null)
      setRelated(rel)
      setLoading(false)
      if (found) {
        document.title = `${found.title} | KCP Forum`
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!id) return
    await contentService.deletePost(id)
    navigate('/')
  }

  const isLocalPost = id?.startsWith('post-') && id.startsWith('post-' + Date.now().toString(36).slice(0, 4))

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-32" />
          <div className="h-10 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
          <div className="aspect-video bg-gray-200 dark:bg-white/10 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <EmptyState
          title="Post not found"
          description="The post you're looking for doesn't exist or has been removed."
          action={
            <Link to="/" className="text-sm text-accent hover:underline">
              Go back home
            </Link>
          }
        />
      </div>
    )
  }

  const cat = categories.find((c) => c.id === post.category)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to feed
      </Link>

      {/* Article */}
      <article>
        {/* Category & meta */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {cat && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: cat.color + '20', color: cat.color }}
            >
              {cat.name}
            </span>
          )}
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {timeAgo(post.createdAt)}
          </span>
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.views.toLocaleString()} views
          </span>
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {post.comments} comments
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          {post.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
            {post.author.name[0]}
          </div>
          <div>
            <p className="font-medium text-sm">{post.author.name}</p>
            <p className="text-xs text-gray-400">Author</p>
          </div>
        </div>

        {/* Media */}
        {post.media && (
          <div className="mb-8">
            <MediaRenderer media={post.media} caption={post.mediaCaption} />
          </div>
        )}

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-line">
            {post.description}
          </p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <Tag className="w-4 h-4 text-gray-400" />
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        {/* Local post actions */}
        {post.id.startsWith('post-' + Date.now().toString(36).slice(0, 3)) && (
          <div className="flex items-center gap-2 pt-6 border-t border-gray-200 dark:border-white/10">
            <Link to={`/edit/${post.id}`}>
              <Button variant="secondary" size="sm" icon={<Edit className="w-4 h-4" />}>
                Edit
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => setDeleteModal(true)}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </Button>
          </div>
        )}
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((p) => (
              <PostCard key={p.id} post={p} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* Delete modal */}
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Post">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
