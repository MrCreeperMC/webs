import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { AuthProvider } from './context/AuthContext'
import { RequireAdmin } from './components/auth/RequireAdmin'
import { useTheme } from './hooks/useTheme'
import Home from './pages/Home'
import Explore from './pages/Explore'
import PostPage from './pages/Post'
import CreatePost from './pages/CreatePost'
import Categories from './pages/Categories'
import About from './pages/About'
import Auth from './pages/Auth'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
            <Route element={<RequireAdmin />}>
              <Route path="/create" element={<CreatePost />} />
              <Route path="/edit/:id" element={<CreatePost editMode />} />
            </Route>
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
