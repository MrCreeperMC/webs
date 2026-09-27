import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { Comment } from '../../types/comment'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { timeAgo } from '../../utils/time'

interface CommentItemProps {
  comment: Comment
  canDelete: boolean
  onDelete: (id: string) => Promise<boolean>
}

export function CommentItem({ comment, canDelete, onDelete }: CommentItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [pending, setPending] = useState(false)

  const initial = comment.author.name.trim().charAt(0).toUpperCase() || 'U'

  const handleDelete = async () => {
    setDeleting(true)
    const ok = await onDelete(comment.id)
    setDeleting(false)
    if (ok) setConfirmOpen(false)
    else setPending(true)
  }

  return (
    <li className="group py-4 flex gap-3 transition-colors hover:bg-white/50 dark:hover:bg-white/[0.03] animate-fade-in">
      {comment.author.avatar ? (
        <img
          src={comment.author.avatar}
          alt=""
          className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
        />
      ) : (
        <span className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
          {initial}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold">{comment.author.name}</span>
          <span className="text-xs text-gray-400">
            <time dateTime={comment.createdAt}>{timeAgo(comment.createdAt)}</time>
          </span>
          {canDelete && (
            <button
              onClick={() => setConfirmOpen(true)}
              className="ml-auto p-1 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              aria-label="Delete comment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-line break-words">
          {comment.content}
        </p>
        {pending && (
          <p className="text-xs text-red-500 mt-1">This comment could not be deleted.</p>
        )}
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete comment"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This comment will be permanently removed.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            loading={deleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </li>
  )
}
