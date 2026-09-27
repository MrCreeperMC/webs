import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function UserMenu() {
  const { session, profile, isAdmin, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="px-3 py-1.5 text-sm font-medium rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          Log in
        </Link>
        <Link
          to="/register"
          className="px-3 py-1.5 text-sm font-medium rounded-xl bg-accent text-white hover:bg-accent-dark transition-colors"
        >
          Register
        </Link>
      </div>
    )
  }

  const name = profile?.displayName ?? session.user.email ?? 'Account'
  const initial = name.trim().charAt(0).toUpperCase() || 'U'

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">
            {initial}
          </span>
        )}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-xl shadow-xl overflow-hidden animate-scale-in z-50"
        >
          <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
            <p className="text-sm font-semibold truncate">{name}</p>
            <span
              className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                isAdmin
                  ? 'bg-accent/10 text-accent dark:bg-accent/20'
                  : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'
              }`}
            >
              {isAdmin ? 'Admin' : 'Member'}
            </span>
          </div>
          <button
            onClick={() => {
              setOpen(false)
              void signOut()
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
            role="menuitem"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export function MobileAuthLinks() {
  const { session } = useAuth()
  if (session) return null

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Link
        to="/login"
        className="flex-1 text-center px-3 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-accent hover:text-accent transition-colors"
      >
        Log in
      </Link>
      <Link
        to="/register"
        className="flex-1 text-center px-3 py-2 text-sm font-medium rounded-xl bg-accent text-white hover:bg-accent-dark transition-colors"
      >
        Register
      </Link>
    </div>
  )
}
