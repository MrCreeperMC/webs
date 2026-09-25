import { Link } from 'react-router-dom'
import { Code, Database, Globe, Shield } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function About() {
  const features = [
    { icon: Globe, title: 'Community-Driven', desc: 'Built for sharing ideas, news, and discoveries with like-minded people.' },
    { icon: Code, title: 'Open Architecture', desc: 'Clean, extensible codebase ready for backend integration.' },
    { icon: Database, title: 'Local-First Demo', desc: 'Runs entirely in your browser with localStorage. No server needed to try it.' },
    { icon: Shield, title: 'Privacy conscious', desc: 'Designed to work with privacy-respecting backends when you connect one.' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-3">About KCP Forum</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          A modern community platform designed for sharing technology news,
          gaming updates, science discoveries, and community discussions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {features.map((f) => (
          <div key={f.title} className="p-6 rounded-2xl glass">
            <f.icon className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to explore?</h2>
        <div className="flex justify-center gap-3">
          <Link to="/explore">
            <Button>Explore Posts</Button>
          </Link>
          <Link to="/create">
            <Button variant="secondary">Create a Post</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
