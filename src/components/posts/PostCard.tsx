import { Link } from 'react-router-dom'
import { Eye, MessageCircle, Clock } from 'lucide-react'
import type { Post } from '../../types/post'
import { Badge } from '../ui/Badge'
import { MediaRenderer, MediaTypeIcon } from '../media/MediaRenderer'
import { categories } from '../../data/categories'
import { timeAgo } from '../../utils/time'

interface PostCardProps {
  post: Post
  variant?: 'standard' | 'featured' | 'compact'
}

function formatViews(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toString()
}

const categoryColor = (id: string) => categories.find((c) => c.id === id)?.color || '#6b7280'

export function PostCard({ post, variant = 'standard' }: PostCardProps) {
  if (variant === 'featured') {
    return (
      <div className="p-px bg-gradient-to-r from-accent/60 via-accent/20 to-transparent rounded-3xl">
        <Link
          to={`/post/${post.id}`}
          className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-[23px] glass card-hover"
        >
          {post.media && (
            <div className="md:w-1/2 aspect-video rounded-xl overflow-hidden shrink-0">
              <MediaRenderer media={post.media} className="w-full h-full" />
            </div>
          )}
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="accent">Featured</Badge>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: categoryColor(post.category) + '20',
                  color: categoryColor(post.category),
                }}
              >
                {post.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3">
              {post.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {post.author.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" aria-hidden />
                {timeAgo(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" aria-hidden />
                {formatViews(post.views)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" aria-hidden />
                {post.comments}
              </span>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/post/${post.id}`}
        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        {post.media && (
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
            <MediaRenderer media={post.media} className="w-full h-full" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {post.author.name} · {timeAgo(post.createdAt)}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/post/${post.id}`}
      className="group flex flex-col rounded-2xl glass card-hover overflow-hidden hover:ring-1 hover:ring-accent/30 hover:shadow-lg hover:shadow-accent/10"
    >
      {post.media && (
        <div className="aspect-video relative overflow-hidden">
          <MediaRenderer media={post.media} className="w-full h-full" />
          {post.mediaType === 'video' && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
              <MediaTypeIcon type="video" /> Video
            </div>
          )}
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: categoryColor(post.category) + '20',
              color: categoryColor(post.category),
            }}
          >
            {post.category}
          </span>
          {post.mediaType !== 'none' && !post.media && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <MediaTypeIcon type={post.mediaType} /> {post.mediaType}
            </span>
          )}
        </div>
        <h3 className="font-semibold mb-1.5 group-hover:text-accent transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
          {post.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2 min-w-0">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt=""
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
            ) : (
              <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                {post.author.name[0]?.toUpperCase()}
              </span>
            )}
            <span className="font-medium text-gray-600 dark:text-gray-300 truncate">
              {post.author.name}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" aria-hidden />
              {formatViews(post.views)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" aria-hidden />
              {post.comments}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function PostCardSkeleton({ variant = 'standard' }: { variant?: 'standard' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex items-start gap-4 p-4 rounded-xl animate-pulse">
        <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-white/10 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-gray-100 dark:bg-white/5 overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200 dark:bg-white/10" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-20" />
        <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded" />
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-5/6" />
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-white/5">
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-24" />
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-16" />
        </div>
      </div>
    </div>
  )
}
