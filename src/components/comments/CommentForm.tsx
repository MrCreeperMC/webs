import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import { Button } from '../ui/Button'

const MAX_LENGTH = 2000

interface CommentFormProps {
  onAdd: (content: string) => Promise<boolean>
  loggedIn: boolean
  disabledWhileLoading?: boolean
}

export function CommentForm({ onAdd, loggedIn, disabledWhileLoading }: CommentFormProps) {
  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const trimmed = value.trim()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!trimmed || submitting) return
    setSubmitting(true)
    const ok = await onAdd(trimmed)
    if (ok) setValue('')
    setSubmitting(false)
  }

  if (!loggedIn) {
    return (
      <div className="glass rounded-xl px-4 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between gap-3">
        <span>Log in to join the discussion.</span>
        <Link to="/login" className="text-accent font-medium hover:underline shrink-0">
          Log in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-4">
      <label htmlFor="comment-input" className="sr-only">
        Write a comment
      </label>
      <textarea
        id="comment-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Share your thoughts…"
        rows={3}
        maxLength={MAX_LENGTH}
        className="w-full bg-transparent resize-y text-sm focus:outline-none placeholder:text-gray-400"
        disabled={disabledWhileLoading || submitting}
      />
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200 dark:border-white/10">
        <span className="text-xs text-gray-400 tabular-nums">
          {value.length}/{MAX_LENGTH}
        </span>
        <Button
          type="submit"
          size="sm"
          loading={submitting}
          disabled={!trimmed || disabledWhileLoading}
          icon={<Send className="w-4 h-4" />}
        >
          Comment
        </Button>
      </div>
    </form>
  )
}
