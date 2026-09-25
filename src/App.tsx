import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { useTheme } from './hooks/useTheme'
import Home from './pages/Home'
import Explore from './pages/Explore'
import PostPage from './pages/Post'
import CreatePost from './pages/CreatePost'
import Categories from './pages/Categories'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<CreatePost editMode />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
