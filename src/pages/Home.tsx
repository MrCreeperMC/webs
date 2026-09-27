import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, MessagesSquare, Layers, FileText } from 'lucide-react'
import { contentService } from '../services/contentService'
import type { Post } from '../types/post'
import { PostCard, PostCardSkeleton } from '../components/posts/PostCard'
import { categories } from '../data/categories'
import { Button } from '../components/ui/Button'

export default function Home() {
  const [featured, setFeatured] = useState<Post | null>(null)
  const [latest, setLatest] = useState<Post[]>([])
  const [popular, setPopular] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [feat, all] = await Promise.all([
        contentService.getFeaturedPost(),
        contentService.getPosts(),
      ])
      setFeatured(feat ?? all[0] ?? null)
      setLatest(all.slice(0, 6))
      setPopular([...all].sort((a, b) => b.views - a.views).slice(0, 4))
      setTotal(all.length)

      const counts: Record<string, number> = {}
      all.forEach((p) => {
        counts[p.category] = (counts[p.category] ?? 0) + 1
      })
      setCategoryCounts(counts)
      setLoading(false)
    }
    void load()
  }, [])

  const stats = [
    { icon: FileText, label: 'Posts', value: total > 0 ? String(total) : '0' },
    { icon: Layers, label: 'Categories', value: String(categories.length) },
    { icon: MessagesSquare, label: 'Discussion', value: 'Open' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Hero */}
      <section className="relative mb-12 text-center sm:text-left overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/20 dark:bg-accent/10 blur-[100px] rounded-full pointer-events-none"
          aria-hidden
        />
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Welcome to <span className="text-accent">KCP Forum</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto sm:mx-0 mb-6">
            Your hub for technology, gaming, science, and community discussion.
          </p>
          <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <Link to="/explore">
              <Button>Browse posts</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost">Learn more</Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center sm:justify-start">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl px-5 py-3 flex items-center gap-3">
                <s.icon className="w-5 h-5 text-accent" aria-hidden />
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">
                    {loading ? '…' : s.value}
                  </p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {loading ? (
        <section className="mb-12">
          <div className="h-64 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
        </section>
      ) : featured ? (
        <section className="mb-12" aria-label="Featured post">
          <PostCard post={featured} variant="featured" />
        </section>
      ) : null}

      {/* Categories strip */}
      <nav className="mb-12" aria-label="Categories">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?category=${cat.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium whitespace-nowrap hover:border-accent/50 hover:shadow-sm hover:shadow-accent/10 transition-all shrink-0"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
                aria-hidden
              />
              {cat.name}
              {!loading && categoryCounts[cat.id] !== undefined && (
                <span className="text-xs text-gray-400 tabular-nums">
                  {categoryCounts[cat.id]}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Latest posts */}
      <section className="mb-12" aria-labelledby="latest-heading">
        <div className="flex items-center justify-between mb-6">
          <h2 id="latest-heading" className="text-2xl font-bold">
            Latest Posts
          </h2>
          <Link
            to="/explore"
            className="flex items-center gap-1 text-sm text-accent hover:underline"
          >
            View all <ArrowRight className="w-4 h-4" aria-hidden />
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
      <section aria-labelledby="popular-heading">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-accent" aria-hidden />
          <h2 id="popular-heading" className="text-2xl font-bold">
            Popular Posts
          </h2>
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
