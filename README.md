# KCP Forum

A modern community forum and news platform built with React, TypeScript, and Tailwind CSS. Deployable to GitHub Pages as a fully static site.

## Features

- Responsive feed with featured, latest, and popular posts
- Full-text search across titles, descriptions, tags, authors, and categories
- Category browsing and filtering
- Media type filtering (image, video, text-only)
- Sort by newest, oldest, or popularity
- Create, edit, and delete posts (localStorage)
- Drag & drop media upload with preview
- Image lightbox
- Video player with controls
- Dark/light theme with system preference detection
- Skeleton loading states
- Empty and error states
- Smooth animations (respects `prefers-reduced-motion`)
- SEO-friendly with meta tags, robots.txt, and sitemap.xml
- Accessible (semantic HTML, keyboard nav, ARIA labels)
- GitHub Actions deployment workflow

## Tech Stack

- **React 18** with TypeScript
- **Vite** for building
- **Tailwind CSS** for styling
- **React Router** for client-side routing (HashRouter for GitHub Pages)
- **Lucide React** for icons

## Installation

```bash
# From the monorepo root
pnpm install --filter @kcp/forum

# Or from apps/forum
cd apps/forum
pnpm install
```

## Development

```bash
pnpm --filter @kcp/forum dev
```

Opens at `http://localhost:5173`.

## Production Build

```bash
pnpm --filter @kcp/forum build
pnpm --filter @kcp/forum preview
```

## GitHub Pages Deployment

### Setup

1. Push this repository to GitHub
2. Go to **Settings > Pages**
3. Set **Source** to **GitHub Actions**
4. The workflow in `.github/workflows/deploy.yml` handles the rest

### Configuring the base path

The Vite config reads `GITHUB_REPOSITORY` from the environment to set the base path automatically. If deploying to `https://USERNAME.github.io/REPOSITORY/`, the base will be `/REPOSITORY/`.

For a **custom domain**, set `base: '/'` in `vite.config.ts` and remove the environment variable logic.

### .nojekyll

The workflow adds a `.nojekyll` file to the build output so GitHub Pages doesn't ignore files starting with underscores.

## Project Structure

```
apps/forum/
  src/
    components/
      layout/       Navbar, Footer
      media/        MediaRenderer, Lightbox
      posts/        PostCard
      ui/           Badge, Button, EmptyState, Modal, Skeleton
    pages/          Home, Explore, Post, CreatePost, Categories, About
    services/       contentService, storageService
    hooks/          useTheme, usePosts, useSearch
    data/           mockPosts, categories
    types/          post.ts
    App.tsx
    main.tsx
    index.css
  public/           favicon, robots.txt, sitemap.xml
  .github/workflows/deploy.yml
```

## localStorage Implementation

Posts are stored in `localStorage` under the key `kcp-forum:posts`. On first load, mock data is seeded. All CRUD operations read from and write to localStorage through `contentService.ts`.

## Replacing the Content Service

The `contentService.ts` file is the single abstraction layer between the UI and data. To connect a real backend, replace the function implementations without changing any UI components.

### Supabase Example

```typescript
// services/contentService.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

export const contentService = {
  async getPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    return data ?? []
  },
  async getPost(id: string) {
    const { data } = await supabase.from('posts').select('*').eq('id', id).single()
    return data ?? undefined
  },
  // ... createPost, updatePost, deletePost
}
```

### Firebase Example

Replace the Supabase calls with Firebase Firestore or Realtime Database queries.

### Custom REST API

Replace with `fetch` or `axios` calls to your API endpoints.

## Future Backend Architecture

```
Frontend (React)
  ↓
API / Content Service (contentService.ts)
  ↓
Authentication (Supabase Auth / Clerk / Auth0)
  ↓
Database (Supabase PostgreSQL / Firebase Firestore)
  ↓
Object Storage (Supabase Storage / S3 / Cloudflare R2)
```

### Environment Variables

When connecting a backend, create a `.env` file:

```bash
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_KEY=your-anon-key
```

Vite exposes `VITE_*` variables to the client bundle.

## License

MIT
