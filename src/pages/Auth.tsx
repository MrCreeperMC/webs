import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'

interface AuthProps {
  mode: 'login' | 'register'
}

export default function Auth({ mode }: AuthProps) {
  const { signIn, signUp, session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const from = location.state?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isLogin = mode === 'login'

  // Already signed in — no reason to show the form.
  useEffect(() => {
    if (session) navigate(from, { replace: true })
  }, [session, from, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        if (displayName.trim().length < 2) {
          throw new Error('Display name must be at least 2 characters.')
        }
        await signUp(email, password, displayName.trim())
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-32 pb-16">
      <div className="glass rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
            {isLogin ? (
              <LogIn className="w-6 h-6 text-white" />
            ) : (
              <UserPlus className="w-6 h-6 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isLogin
              ? 'Log in to comment and join the discussion.'
              : 'Register to comment and be part of the community.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-1.5">
                Display name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How others will see you"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                required
                minLength={2}
                maxLength={50}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
              required
              minLength={6}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" loading={submitting} className="w-full" size="lg">
            {isLogin ? 'Log in' : 'Create account'}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
          {isLogin ? (
            <>
              No account?{' '}
              <Link to="/register" className="text-accent hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:underline">
                Log in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
