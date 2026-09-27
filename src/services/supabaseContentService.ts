import type { Post, Media, Author } from '../types/post'
import { supabase } from '../lib/supabase'
import type { ContentService, NewPostInput } from './types'

interface ProfileEmbed {
  display_name: string
  avatar_url: string | null
}

interface PostRow {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  media_type: 'image' | 'video' | 'none'
  media_url: string | null
  media_alt: string | null
  media_caption: string | null
  views: number
  comments: number
  featured: boolean
  created_at: string
  updated_at: string
  author_id: string
  author: ProfileEmbed | ProfileEmbed[] | null
}

const POST_SELECT = `id,title,description,category,tags,media_type,media_url,media_alt,media_caption,views,comments,featured,created_at,updated_at,author_id,author:author_id(display_name,avatar_url)`

function toAuthor(embed: PostRow['author']): Author {
  const profile = Array.isArray(embed) ? embed[0] : embed
  return {
    name: profile?.display_name ?? 'Unknown',
    avatar: profile?.avatar_url ?? undefined,
  }
}

function toMedia(row: PostRow): Media | undefined {
  if (row.media_type === 'none' || !row.media_url) return undefined
  return {
    type: row.media_type,
    url: row.media_url,
    alt: row.media_alt ?? row.title,
    caption: row.media_caption ?? undefined,
  }
}

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    author: toAuthor(row.author),
    authorId: row.author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.category,
    tags: row.tags ?? [],
    media: toMedia(row),
    mediaType: row.media_type,
    mediaCaption: row.media_caption ?? undefined,
    views: row.views,
    comments: row.comments,
    featured: row.featured,
  }
}

function sanitize(q: string): string {
  return q.replace(/[,()]/g, ' ').trim()
}

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('You must be logged in to do this.')
  return data.user.id
}

async function toInputRow(data: NewPostInput) {
  return {
    title: data.title,
    description: data.description,
    category: data.category,
    tags: data.tags,
    media_type: data.mediaType,
    media_url: data.media?.url ?? null,
    media_alt: data.media?.alt ?? null,
    media_caption: data.mediaCaption ?? data.media?.caption ?? null,
    featured: data.featured ?? false,
    author_id: await getCurrentUserId(),
  }
}

export const supabaseContentService: ContentService = {
  async getPosts(): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data as unknown as PostRow[]).map(toPost)
  },

  async getPost(id: string): Promise<Post | undefined> {
    const { data, error } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data ? toPost(data as unknown as PostRow) : undefined
  },

  async createPost(data: NewPostInput): Promise<Post> {
    const row = await toInputRow(data)
    const { data: created, error } = await supabase
      .from('posts')
      .insert(row)
      .select(POST_SELECT)
      .single()
    if (error) throw new Error(error.message)
    return toPost(created as unknown as PostRow)
  },

  async updatePost(id: string, data: Partial<Post>): Promise<Post | undefined> {
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (data.title !== undefined) patch.title = data.title
    if (data.description !== undefined) patch.description = data.description
    if (data.category !== undefined) patch.category = data.category
    if (data.tags !== undefined) patch.tags = data.tags
    if (data.mediaType !== undefined) patch.media_type = data.mediaType
    if (data.media !== undefined) {
      patch.media_url = data.media?.url ?? null
      patch.media_alt = data.media?.alt ?? null
    }
    if (data.mediaCaption !== undefined) patch.media_caption = data.mediaCaption ?? null
    if (data.featured !== undefined) patch.featured = data.featured

    const { data: updated, error } = await supabase
      .from('posts')
      .update(patch)
      .eq('id', id)
      .select(POST_SELECT)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return updated ? toPost(updated as unknown as PostRow) : undefined
  },

  async deletePost(id: string): Promise<boolean> {
    const { data, error } = await supabase.from('posts').delete().eq('id', id).select('id')
    if (error) throw new Error(error.message)
    return (data?.length ?? 0) > 0
  },

  async searchPosts(query: string): Promise<Post[]> {
    const q = sanitize(query)
    if (!q) return this.getPosts()

    const pattern = `%${q}%`
    const [postsRes, profilesRes] = await Promise.all([
      supabase
        .from('posts')
        .select(POST_SELECT)
        .or(
          `title.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern},tags.cs.{${q}}`
        )
        .order('created_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('id')
        .ilike('display_name', pattern),
    ])

    if (postsRes.error) throw new Error(postsRes.error.message)

    const byContent = (postsRes.data as unknown as PostRow[]).map(toPost)
    const matchingIds = (profilesRes.data ?? []).map((p) => p.id)

    if (matchingIds.length > 0) {
      const byAuthor = await supabase
        .from('posts')
        .select(POST_SELECT)
        .in('author_id', matchingIds)
        .order('created_at', { ascending: false })
      if (byAuthor.error) throw new Error(byAuthor.error.message)

      const seen = new Set(byContent.map((p) => p.id))
      for (const row of byAuthor.data as unknown as PostRow[]) {
        if (!seen.has(row.id)) byContent.push(toPost(row))
      }
    }

    return byContent
  },

  async getPostsByCategory(category: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .eq('category', category)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data as unknown as PostRow[]).map(toPost)
  },

  async getFeaturedPost(): Promise<Post | undefined> {
    const { data, error } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .eq('featured', true)
      .limit(1)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data ? toPost(data as unknown as PostRow) : undefined
  },

  async getRelatedPosts(postId: string, limit = 4): Promise<Post[]> {
    const post = await this.getPost(postId)
    if (!post) return []

    const { data, error } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .neq('id', postId)
      .eq('category', post.category)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw new Error(error.message)

    const result = (data as unknown as PostRow[]).map(toPost)
    if (result.length < limit) {
      const { data: tagData, error: tagError } = await supabase
        .from('posts')
        .select(POST_SELECT)
        .neq('id', postId)
        .neq('category', post.category)
        .order('views', { ascending: false })
        .limit(limit)
      if (tagError) throw new Error(tagError.message)

      const seen = new Set(result.map((p) => p.id))
      for (const row of tagData as unknown as PostRow[]) {
        if (seen.has(row.id)) continue
        const candidate = toPost(row)
        if (candidate.tags.some((t) => post.tags.includes(t))) {
          result.push(candidate)
          if (result.length >= limit) break
        }
      }
    }

    return result.slice(0, limit)
  },
}
