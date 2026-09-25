import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { contentService } from '../services/contentService'
import type { Post } from '../types/post'
import { PostCard, PostCardSkeleton } from '../components/posts/PostCard'
import { categories } from '../data/categories'

export default function Home() {
  const [featured, setFeatured] = useState<Post | null>(null)
  const [latest, setLatest] = useState<Post[]>([])
  const [popular, setPopular] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [feat, all] = await Promise.all([
        contentService.getFeaturedPost(),
        contentService.getPosts(),
      ])
      setFeatured(feat || all[0] || null)
      setLatest(all.slice(0, 6))
      setPopular([...all].sort((a, b) => b.views - a.views).slice(0, 4))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Hero */}
      <section className="mb-12 text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          Welcome to{' '}
          <span className="text-accent">KCP Forum</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
          Your hub for technology, gaming, science, and community discussion.
        </p>
      </section>

      {/* Featured */}
      {loading ? (
        <section className="mb-12">
          <div className="h-64 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
        </section>
      ) : featured ? (
        <section className="mb-12">
          <PostCard post={featured} variant="featured" />
        </section>
      ) : null}

      {/* Categories strip */}
      <section className="mb-12">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium whitespace-nowrap hover:border-accent hover:text-accent transition-colors shrink-0"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Latest posts */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <Link
            to="/explore"
            className="flex items-center gap-1 text-sm text-accent hover:underline"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Popular posts */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-bold">Popular Posts</h2>
        </div>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <PostCardSkeleton key={i} variant="compact" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {popular.map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
