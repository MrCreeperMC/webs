import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-lg">KCP Forum</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              A modern community forum and news platform.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Navigation</h4>
            <div className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/explore', label: 'Explore' },
                { to: '/categories', label: 'Categories' },
                { to: '/about', label: 'About' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Built with React, TypeScript & Tailwind CSS. Deployed on GitHub Pages.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} KCP Forum. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
