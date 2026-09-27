import type { Post } from '../types/post'

export type NewPostInput = Omit<Post, 'id' | 'createdAt' | 'views' | 'comments'>

export interface ContentService {
  getPosts(): Promise<Post[]>
  getPost(id: string): Promise<Post | undefined>
  createPost(data: NewPostInput): Promise<Post>
  updatePost(id: string, data: Partial<Post>): Promise<Post | undefined>
  deletePost(id: string): Promise<boolean>
  searchPosts(query: string): Promise<Post[]>
  getPostsByCategory(category: string): Promise<Post[]>
  getFeaturedPost(): Promise<Post | undefined>
  getRelatedPosts(postId: string, limit?: number): Promise<Post[]>
}
