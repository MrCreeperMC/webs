# KCP Forum

A modern community forum and news platform built with React, TypeScript, and Tailwind CSS, backed by Supabase (auth, database, media storage) and deployed to GitHub Pages.

## Features

- **Accounts**: register / login (Supabase Auth, email + password)
- **Admin gating**: only admins can create, edit, and delete posts (enforced in the database via Row Level Security)
- **Comments**: any logged-in user can comment; owners and admins can delete
- **Persistent data**: posts, comments, and media files live in Supabase — not in the browser
- Responsive feed with featured, latest, and popular posts
- Client-side search (title, description, tags, author, category)
- Category and media-type filters, sort by newest/oldest/popularity
- Drag & drop media upload (images/videos, max 50 MB) to cloud storage
- Image lightbox, HTML5 video player with poster
- Dark/light theme with system preference detection and localStorage persistence
- Skeleton loaders, empty states, form validation, character counters
- Smooth animations that respect `prefers-reduced-motion`
- SEO basics: meta tags, Open Graph, robots.txt, sitemap.xml, favicon
- GitHub Actions deployment workflow

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** (dark mode via `class`)
- **React Router 6** (HashRouter — works on GitHub Pages without server config)
- **Supabase** — Auth, PostgreSQL, Storage
- **Lucide React** icons

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

Without `.env`, the app runs in **localStorage demo mode** (mock posts, local-only writes) — useful for UI work.

### Production build

```bash
pnpm build
pnpm preview
```

## Supabase setup (persistent data + accounts)

The app reads two environment variables. When they are present it uses Supabase; when absent it falls back to localStorage.

1. Create a free account at [supabase.com](https://supabase.com) → **New project**.
2. Open **SQL Editor** → run [`supabase/schema.sql`](supabase/schema.sql) (tables, RLS policies, triggers, storage bucket), then [`supabase/seed.sql`](supabase/seed.sql) (demo posts + comments).
3. In **Project Settings → API**, copy the **Project URL** and **anon public key**.
4. Create a local `.env` (see [`.env.example`](.env.example)):

   ```bash
   VITE_SUPABASE_URL=https://YOUR-REF.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Recommended dashboard tweaks:
   - **Authentication → Email**: disable *Confirm email* (simplest for a HashRouter site), and set **Site URL** to `https://mrcreepermc.github.io/webs/`.
6. Register your account on the site, then in **Table Editor → profiles** set your row's `role` to `admin`. You can now publish, edit, and delete posts.

### Make yourself admin

Only users with `role = 'admin'` can post. To promote an account:

1. Register on the site.
2. Supabase Dashboard → **Table Editor** → `profiles` → find your row → set `role` = `admin`.

There is intentionally no self-serve admin path; roles can only be changed from the dashboard (enforced by a database trigger).

## GitHub Pages deployment

1. Push this repo to GitHub.
2. Repo **Settings → Pages → Source**: select **GitHub Actions**.
3. Repo **Settings → Secrets and variables → Actions**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Push to `main` — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) installs, builds (with the secrets), and deploys.

The Vite `base` path is derived from `GITHUB_REPOSITORY`, so the site works at `https://USERNAME.github.io/REPOSITORY/`. For a **custom domain**, set `base: '/'` in `vite.config.ts` and add a `CNAME` file in `public/`.

## Project structure

```
src/
  components/
    auth/        RequireAdmin route guard
    comments/    CommentSection / CommentItem / CommentForm
    layout/      Navbar, Footer, UserMenu
    media/       MediaRenderer, Lightbox
    posts/       PostCard (+ skeletons)
    ui/          Badge, Button, EmptyState, Modal, Skeleton
  context/       AuthContext (session, profile, isAdmin)
  data/          mockPosts (demo mode), categories config
  hooks/         useTheme, usePosts, useSearch
  lib/           supabase client
  pages/         Home, Explore, Post, CreatePost, Auth, Categories, About
  services/      contentService (facade), local/Supabase implementations,
                 commentService, mediaService, storageService
  types/         post, comment
  utils/         time helpers
supabase/        schema.sql, seed.sql
```

### Content service architecture

```
UI (pages/hooks)
  ↓
contentService.ts        ← facade, picks implementation at build time
  ├─ localContentService   (localStorage — demo mode, no .env)
  └─ supabaseContentService (Postgres — production)
```

Swapping to another backend (Firebase, custom REST) only means writing one more implementation of the `ContentService` interface in `src/services/types.ts` — no UI changes.

## Data model

- `profiles` — id, display_name, avatar_url, role (`user`/`admin`); auto-created by trigger on signup
- `posts` — title, description, category, tags[], media (type/url/alt/caption), views, comments counter, featured
- `comments` — post_id, author_id, content; a trigger keeps `posts.comments` in sync
- Storage bucket `post-media` — public, 50 MB limit, admin-only writes (RLS on `storage.objects`)

## Security notes

- All writes are enforced by PostgreSQL **Row Level Security**, not just hidden buttons:
  - posts: admin-only insert/update/delete
  - comments: authenticated insert as self; delete own or admin
  - roles: cannot be changed by regular users (trigger)
- The anon key in the frontend is safe to expose — RLS is the real boundary.
- Authentication and permissions should be extended if a richer role system is needed later.

## License

MIT
