import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

// Only used when configured; the contentService facade guarantees it is
// never touched in localStorage fallback mode.
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(url, anonKey)
  : (null as unknown as SupabaseClient)

export const POST_MEDIA_BUCKET = 'post-media'
