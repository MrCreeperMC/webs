export interface Comment {
  id: string
  postId: string
  content: string
  createdAt: string
  author: {
    name: string
    avatar?: string
  }
  authorId: string
}
