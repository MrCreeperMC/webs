import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu, Gamepad2, Newspaper, Clapperboard, Atom, Globe, Users, Folder } from 'lucide-react'
import { categories } from '../data/categories'
import { contentService } from '../services/contentService'

const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  Cpu, Gamepad2, Newspaper, Clapperboard, Atom, Globe, Users, Folder,
}

export default function Categories() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    async function load() {
      const posts = await contentService.getPosts()
      const c: Record<string, number> = {}
      posts.forEach((p) => { c[p.category] = (c[p.category] || 0) + 1 })
      setCounts(c)
    }
    load()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-gray-500 dark:text-gray-400">Browse posts by topic.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Folder
          return (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.id}`}
              className="group p-6 rounded-2xl glass card-hover"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: cat.color + '15' }}
              >
                <Icon className="w-6 h-6" style={{ color: cat.color }} />
              </div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {cat.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">
                  {counts[cat.id] || 0} posts
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
