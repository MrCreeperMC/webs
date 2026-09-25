interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors'
  const variants = {
    default: 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300',
    accent: 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-light',
  }
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
