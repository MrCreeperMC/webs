import type { Comment } from '../types/comment'
import { supabase } from '../lib/supabase'

interface CommentRow {
  id: string
  post_id: string
  content: string
  created_at: string
  author_id: string
  author: { display_name: string; avatar_url: string | null } | null
}

const COMMENT_SELECT =
  'id,post_id,content,created_at,author_id,author:author_id(display_name,avatar_url)'

function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    content: row.content,
    createdAt: row.created_at,
    authorId: row.author_id,
    author: {
      name: row.author?.display_name ?? 'Unknown',
      avatar: row.author?.avatar_url ?? undefined,
    },
  }
}

export const commentService = {
  async getComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(COMMENT_SELECT)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    return (data as unknown as CommentRow[]).map(toComment)
  },

  async createComment(postId: string, content: string): Promise<Comment> {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) throw new Error('You must be logged in to comment.')

    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, content, author_id: userData.user.id })
      .select(COMMENT_SELECT)
      .single()
    if (error) throw new Error(error.message)
    return toComment(data as unknown as CommentRow)
  },

  async deleteComment(id: string): Promise<boolean> {
    const { data, error } = await supabase.from('comments').delete().eq('id', id).select('id')
    if (error) throw new Error(error.message)
    return (data?.length ?? 0) > 0
  },
}
