import { useEffect } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { usePosts } from '../hooks/usePosts'
import { useSearch } from '../hooks/useSearch'
import { PostCard, PostCardSkeleton } from '../components/posts/PostCard'
import { EmptyState } from '../components/ui/EmptyState'
import { categories } from '../data/categories'
import type { SortOption, MediaTypeFilter } from '../types/post'

export default function Explore() {
  const {
    posts, loading, sort, setSort, mediaFilter, setMediaFilter,
    categoryFilter, setCategoryFilter, setSearchQuery, loadMore, hasMore, total,
  } = usePosts()

  const { value: searchValue, handleChange: handleSearchChange, clear: clearSearch } = useSearch(
    setSearchQuery,
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const q = params.get('q')
    const cat = params.get('category')
    if (q) handleSearchChange(q)
    if (cat) setCategoryFilter(cat)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore</h1>
        <p className="text-gray-500 dark:text-gray-400">Browse all posts in the community.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by title, description, tags, author..."
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <SlidersHorizontal className="w-4 h-4" /> Filters:
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={mediaFilter}
          onChange={(e) => setMediaFilter(e.target.value as MediaTypeFilter)}
          className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="text">Text Only</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {loading ? 'Loading...' : `${total} post${total !== 1 ? 's' : ''} found`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="Try adjusting your search or filters."
          action={searchValue ? <button onClick={clearSearch} className="text-sm text-accent hover:underline">Clear search</button> : undefined}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                className="px-6 py-2.5 text-sm font-medium rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-accent hover:text-accent transition-colors"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
