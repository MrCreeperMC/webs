import { useState, useEffect, useCallback } from 'react'
import type { Post, SortOption, MediaTypeFilter } from '../types/post'
import { contentService } from '../services/contentService'

const PAGE_SIZE = 6

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortOption>('newest')
  const [mediaFilter, setMediaFilter] = useState<MediaTypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    let result = searchQuery
      ? await contentService.searchPosts(searchQuery)
      : await contentService.getPosts()

    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter)
    }

    if (mediaFilter !== 'all') {
      result = result.filter((p) => {
        if (mediaFilter === 'text') return p.mediaType === 'none'
        return p.mediaType === mediaFilter
      })
    }

    if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sort === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else {
      result.sort((a, b) => b.views - a.views)
    }

    setPosts(result)
    setLoading(false)
  }, [sort, mediaFilter, categoryFilter, searchQuery])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [sort, mediaFilter, categoryFilter, searchQuery])

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + PAGE_SIZE)
  }, [])

  const displayed = posts.slice(0, displayCount)
  const hasMore = displayCount < posts.length

  const refresh = useCallback(async () => {
    await fetchPosts()
  }, [fetchPosts])

  return {
    posts: displayed,
    allPosts: posts,
    loading,
    sort,
    setSort,
    mediaFilter,
    setMediaFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    loadMore,
    hasMore,
    refresh,
    total: posts.length,
  }
}
