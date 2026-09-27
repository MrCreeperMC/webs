import { isSupabaseConfigured } from '../lib/supabase'
import { localContentService } from './localContentService'
import { supabaseContentService } from './supabaseContentService'
import type { ContentService } from './types'

// Facade: pages/hooks import this and never care where data comes from.
// With VITE_SUPABASE_* set, data is persistent (Postgres + Storage).
// Without them, the app runs in localStorage demo mode.
export const contentService: ContentService = isSupabaseConfigured
  ? supabaseContentService
  : localContentService
