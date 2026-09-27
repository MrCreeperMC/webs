import { useCallback, useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import type { Comment } from '../../types/comment'
import { commentService } from '../../services/commentService'
import { isSupabaseConfigured } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { Skeleton } from '../ui/Skeleton'
import { EmptyState } from '../ui/EmptyState'

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { session, isAdmin } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    try {
      setError(null)
      const list = await commentService.getComments(postId)
      setComments(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load comments.')
    } finally {
      setLoading(false)
    }
  }, [postId])

  useEffect(() => {
    void load()
  }, [load])

  const handleAdd = async (content: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return false
    try {
      const created = await commentService.createComment(postId, content)
      setComments((prev) => [...prev, created])
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post the comment.')
      return false
    }
  }

  const handleDelete = async (id: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return false
    try {
      await commentService.deleteComment(id)
      setComments((prev) => prev.filter((c) => c.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the comment.')
      return false
    }
  }

  if (!isSupabaseConfigured) return null

  return (
    <section className="mt-12" aria-labelledby="comments-heading">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-accent" aria-hidden />
        <h2 id="comments-heading" className="text-2xl font-bold">
          Comments <span className="text-gray-400 font-normal">({comments.length})</span>
        </h2>
      </div>

      <CommentForm
        onAdd={handleAdd}
        loggedIn={Boolean(session)}
        disabledWhileLoading={loading}
      />

      {error && (
        <p className="mt-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="mt-6 border-t border-gray-200 dark:border-white/10">
        {loading ? (
          <div className="space-y-4 py-6">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <EmptyState
            icon={<MessageCircle className="w-8 h-8 text-gray-400" />}
            title="No comments yet"
            description={
              session
                ? 'Be the first to share your thoughts on this post.'
                : 'Log in to join the discussion.'
            }
          />
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-white/10">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                canDelete={isAdmin || comment.authorId === session?.user.id}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
