export interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  postCount: number
}

export const categories: Category[] = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'Latest in tech, programming, and digital innovation',
    icon: 'Cpu',
    color: '#6366f1',
    postCount: 0,
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Game news, reviews, and community discussion',
    icon: 'Gamepad2',
    color: '#8b5cf6',
    postCount: 0,
  },
  {
    id: 'news',
    name: 'News',
    description: 'Breaking news and current events',
    icon: 'Newspaper',
    color: '#ef4444',
    postCount: 0,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Movies, music, TV shows, and pop culture',
    icon: 'Clapperboard',
    color: '#f59e0b',
    postCount: 0,
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Discoveries, research, and scientific breakthroughs',
    icon: 'Atom',
    color: '#10b981',
    postCount: 0,
  },
  {
    id: 'internet',
    name: 'Internet',
    description: 'Internet culture, memes, and online trends',
    icon: 'Globe',
    color: '#06b6d4',
    postCount: 0,
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Community events, discussions, and announcements',
    icon: 'Users',
    color: '#ec4899',
    postCount: 0,
  },
]
