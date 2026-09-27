import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Plus, Sun, Moon, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { UserMenu, MobileAuthLinks } from './UserMenu'

interface NavbarProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const location = useLocation()
  const { isAdmin } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore' },
    { to: '/categories', label: 'Categories' },
    { to: '/about', label: 'About' },
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.location.hash = `#/explore?q=${encodeURIComponent(searchInput.trim())}`
      setSearchOpen(false)
      setSearchInput('')
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/5 dark:shadow-black/20 border-white/10 dark:border-white/5'
          : 'glass border-white/5 dark:border-white/[0.03]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">KCP Forum</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-accent'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-accent transition-transform duration-200 ${
                    isActive(link.to) ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search posts..."
                  className="w-56 px-3 py-1.5 text-sm rounded-lg bg-white/60 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  autoFocus
                  aria-label="Search posts"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchInput('')
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <UserMenu />

            {isAdmin && (
              <Link
                to="/create"
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Post
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-gray-200 dark:border-white/10 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search posts..."
                className="w-full px-3 py-2 text-sm rounded-lg bg-white/60 dark:bg-white/10 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
                aria-label="Search posts"
              />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-accent bg-accent/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <MobileAuthLinks />
            {isAdmin && (
              <Link
                to="/create"
                className="flex items-center justify-center gap-2 px-3 py-2 mt-2 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Post
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
