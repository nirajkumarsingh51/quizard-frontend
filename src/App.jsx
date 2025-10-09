import React from 'react'
import { BrowserRouter, Routes, Route, useSearchParams, useLocation, Link } from 'react-router-dom'
import Home from './pages/Home'
import Topic from './pages/Topic'
import Lobby from './pages/Lobby'
import Game from './pages/Game'
import Rules from './pages/Rules'
import Result from './pages/Result'
import Team from './pages/Team'
import Contact from './pages/Contact'
import './components/Navbar.css'

export default function App(){
  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/topic/:id" element={<Topic/>} />
            <Route path="/room/:id" element={<RedirectRoom/>} />
            <Route path="/lobby" element={<Lobby/>} />
            <Route path="/team" element={<Team/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/rules" element={<Rules/>} />
            <Route path="/result" element={<Result/>} />
            <Route path="/game" element={<GameWrapper/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

function NavBar(){
  const [open, setOpen] = React.useState(false)
  const navRef = React.useRef(null)
  const firstLinkRef = React.useRef(null)

  // close when clicking outside or on Escape
  React.useEffect(() => {
    function handleDocClick(e){
      if (!open) return
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false)
    }
    function handleKey(e){
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleDocClick)
    document.addEventListener('touchstart', handleDocClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleDocClick)
      document.removeEventListener('touchstart', handleDocClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  // move focus into menu when opened
  React.useEffect(() => {
    if (open) {
      // focus the first link for keyboard users
      setTimeout(() => firstLinkRef.current?.focus(), 80)
    }
  }, [open])

  return (
    <header className="site-nav" ref={navRef}>
      <div className="nav-inner container-fluid">
        <Link to="/" className="brand" onClick={()=>setOpen(false)}>Quizard</Link>

        <button
          className="nav-toggle"
          aria-label={open? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={()=>setOpen(!open)}
        >
          <span className="hamburger" />
        </button>

        <nav id="main-navigation" className={`nav-links ${open? 'open':''}`} aria-hidden={!open}>
          <Link ref={firstLinkRef} to="/" className="nav-link" onClick={()=>setOpen(false)}>Home</Link>
          <Link to="/lobby" className="nav-link" onClick={()=>setOpen(false)}>Play Game</Link>
          <Link to="/rules" className="nav-link" onClick={()=>setOpen(false)}>Game Rules</Link>
          <Link to="/team" className="nav-link" onClick={()=>setOpen(false)}>Team</Link>
          <Link to="/contact" className="nav-link" onClick={()=>setOpen(false)}>Contact</Link>
        </nav>
      </div>
    </header>
  )
}

function Footer(){
  return (
    <footer className="app-footer">
      <div className="footer-inner">© {new Date().getFullYear()} Quizard — Built with neon vibes</div>
    </footer>
  )
}

function RedirectRoom(){
  const loc = useLocation()
  // perform redirect once after the location is available
  React.useEffect(() => {
    const raw = loc.pathname || ''
    const parts = raw.split('/')
    const id = parts[2] || ''
    const params = new URLSearchParams()
    if (id) params.set('room', id)
    params.set('name', 'Host')
  const to = `/lobby?${params.toString()}`
    // perform redirect
    window.location.replace(to)
  }, [loc])

  return null
}

function GameWrapper(){
  const [search] = useSearchParams()
  const roomId = search.get('room')
  const name = search.get('name')
  return <Game roomId={roomId} playerName={name} />
}
