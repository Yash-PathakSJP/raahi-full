import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import { navLinks } from '../data/siteContent.js'
import { IconMenu, IconClose } from './Icons.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (href) => {
    setActive(href)
    setMenuOpen(false)
  }

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#home" className="brand" onClick={() => handleNavClick('#home')}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="30" height="30">
              <defs>
                <linearGradient id="headerBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="9" fill="url(#headerBrandGrad)" />
              <path d="M9 21 L16 8 L23 21 L16 17 Z" fill="white" />
            </svg>
          </span>
          <span className="brand-name">RAAHI</span>
        </a>

        <nav className="nav-desktop" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${active === link.href ? 'is-active' : ''}`}
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <ThemeToggle className="header-theme-toggle" />
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm header-cta">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="nav-link header-login-link">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm header-cta">Get Started</Link>
            </>
          )}
          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <IconClose width="22" height="22" /> : <IconMenu width="22" height="22" />}
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}>
        <nav className="mobile-nav-links" aria-label="Mobile">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`mobile-nav-link ${active === link.href ? 'is-active' : ''}`}
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-primary btn-block" onClick={() => setMenuOpen(false)}>
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-block" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-block" onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
