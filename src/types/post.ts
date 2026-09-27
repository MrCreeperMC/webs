export interface Media {
  type: 'image' | 'video' | 'external'
  url: string
  thumbnail?: string
  alt: string
  caption?: string
}

export interface Post {
  id: string
  title: string
  description: string
  author: Author
  authorId?: string
  createdAt: string
  updatedAt?: string
  category: string
  tags: string[]
  media?: Media
  mediaType: 'image' | 'video' | 'none'
  mediaCaption?: string
  views: number
  comments: number
  featured?: boolean
}

export interface Author {
  name: string
  avatar?: string
}

export type SortOption = 'newest' | 'oldest' | 'popular'

export type MediaTypeFilter = 'all' | 'image' | 'video' | 'text'
