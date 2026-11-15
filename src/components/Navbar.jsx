/* ─── Navbar ───────────────────────────────────────────────────────────────
   Fixed top navigation bar.
   - React Router <Link> / <NavLink> — no full-page reloads
   - Shows trainee callsign pill when a profile exists
   - Hamburger menu for mobile (≤768px)
─────────────────────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import useTrainee from '../hooks/useTrainee'
import useSound   from '../hooks/useSound'

export default function Navbar() {
  const { trainee }             = useTrainee()
  const { enabled, volume, toggleSound, changeVolume, sounds } = useSound()
  const [open, setOpen]         = useState(false)
  const [volOpen, setVolOpen]   = useState(false)
  const location                = useLocation()

  useEffect(() => { setOpen(false); setVolOpen(false) }, [location.pathname])

  // Close menu on Escape key
  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const navLinks = [
    { to: '/',          label: 'Home',      end: true },
    { to: '/dashboard', label: 'Dashboard', end: false },
    { to: '/training',  label: 'Training',  end: false },
    { to: '/mission',   label: 'Ch.1',      end: false },
    { to: '/outpost',   label: 'Ch.2',      end: false },
    { to: '/about',     label: 'About',     end: false },
  ]

  return (
    <header className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo" aria-label="ASTROBASE home">
        <span className="logo-icon" aria-hidden="true">✦</span>
        <span className="logo-text">ASTROBASE</span>
      </Link>

      {/* Desktop nav links */}
      <nav className="navbar-nav" aria-label="Main navigation">
        <ul className="nav-links">
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => isActive ? 'nav-active' : ''}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right-side CTA — desktop */}
      <div className="navbar-right">
        {trainee ? (
          <Link
            to="/dashboard"
            className="nav-cta nav-cta--active"
            aria-label={`Dashboard — ${trainee.callsign}`}
          >
            <span aria-hidden="true">🧑‍🚀</span>
            <span className="nav-cta-callsign">{trainee.callsign}</span>
          </Link>
        ) : (
          <Link to="/register" className="nav-cta">
            Register →
          </Link>
        )}

        {/* Sound controls */}
        <div className="snd-controls">
          <button
            className={`snd-toggle${enabled ? ' snd-toggle--on' : ''}`}
            onClick={() => { sounds.click(); toggleSound() }}
            aria-label={enabled ? 'Mute sound' : 'Enable sound'}
            title={enabled ? 'Sound ON — click to mute' : 'Sound OFF — click to enable'}
          >
            {enabled ? '🔊' : '🔇'}
          </button>

          {enabled && (
            <div className="snd-vol-wrap" aria-label="Volume control">
              <input
                type="range"
                className="snd-vol-slider"
                min="0" max="1" step="0.05"
                value={volume}
                onChange={e => changeVolume(parseFloat(e.target.value))}
                aria-label="Volume"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
            </div>
          )}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className={`nav-hamburger${open ? ' nav-hamburger--open' : ''}`}
          onClick={() => { sounds.click(); setOpen(o => !o) }}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Mobile navigation"
        >
          <ul>
            {navLinks.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => `mobile-link${isActive ? ' mobile-link--active' : ''}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              {trainee ? (
                <Link to="/dashboard" className="mobile-link mobile-link--cta">
                  🧑‍🚀 {trainee.callsign}
                </Link>
              ) : (
                <Link to="/register" className="mobile-link mobile-link--cta">
                  Register →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
