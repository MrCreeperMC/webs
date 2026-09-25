const STORAGE_PREFIX = 'kcp-forum:'

export const storageService = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch {
      console.warn('Failed to write to localStorage')
    }
  },

  remove(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key)
  },
}
