import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { EmptyState } from '../ui/EmptyState'

export function RequireAdmin() {
  const { session, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-32 pb-16">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-16">
        <EmptyState
          icon={<ShieldAlert className="w-8 h-8 text-gray-400" />}
          title="Admins only"
          description="Only administrators can create or edit posts. Browse the latest posts instead."
          action={
            <Link to="/explore" className="text-sm text-accent hover:underline">
              Explore posts
            </Link>
          }
        />
      </div>
    )
  }

  return <Outlet />
}
