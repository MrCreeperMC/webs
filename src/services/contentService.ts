import type { Post } from '../types/post'
import { mockPosts } from '../data/mockPosts'
import { storageService } from './storageService'

const POSTS_KEY = 'posts'

function generateId(): string {
  return 'post-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function getAllPosts(): Post[] {
  const stored = storageService.get<Post[]>(POSTS_KEY)
  if (stored) return stored
  storageService.set(POSTS_KEY, mockPosts)
  return [...mockPosts]
}

function savePosts(posts: Post[]): void {
  storageService.set(POSTS_KEY, posts)
}

export const contentService = {
  async getPosts(): Promise<Post[]> {
    return getAllPosts().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  async getPost(id: string): Promise<Post | undefined> {
    return getAllPosts().find((p) => p.id === id)
  },

  async createPost(data: Omit<Post, 'id' | 'createdAt' | 'views' | 'comments'>): Promise<Post> {
    const posts = getAllPosts()
    const newPost: Post = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      views: 0,
      comments: 0,
    }
    posts.unshift(newPost)
    savePosts(posts)
    return newPost
  },

  async updatePost(id: string, data: Partial<Post>): Promise<Post | undefined> {
    const posts = getAllPosts()
    const idx = posts.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    posts[idx] = { ...posts[idx], ...data, updatedAt: new Date().toISOString() }
    savePosts(posts)
    return posts[idx]
  },

  async deletePost(id: string): Promise<boolean> {
    const posts = getAllPosts()
    const filtered = posts.filter((p) => p.id !== id)
    if (filtered.length === posts.length) return false
    savePosts(filtered)
    return true
  },

  async searchPosts(query: string): Promise<Post[]> {
    const q = query.toLowerCase()
    return getAllPosts().filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  },

  async getPostsByCategory(category: string): Promise<Post[]> {
    return getAllPosts().filter((p) => p.category === category)
  },

  async getFeaturedPost(): Promise<Post | undefined> {
    return getAllPosts().find((p) => p.featured)
  },

  async getRelatedPosts(postId: string, limit = 4): Promise<Post[]> {
    const post = await this.getPost(postId)
    if (!post) return []
    const all = getAllPosts().filter((p) => p.id !== postId)
    return all
      .filter((p) => p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
      .slice(0, limit)
  },
}
