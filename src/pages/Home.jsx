/* ─── Home page — Figma visual integration ─────────────────────────────────
   Route: /
   Visual design from ASTROBASEfigma: lunar scene, outpost, menu layout.
   All routing and links are preserved from the original ASTROBASE project.
─────────────────────────────────────────────────────────────────────────── */
import { Link } from 'react-router-dom'
import useTrainee from '../hooks/useTrainee'

/* ── Figma lunar scene background ──────────────────────────────────────── */
function LunarScene({ children, className = '' }) {
  return (
    <div className={`fg-lunar-scene${className ? ` ${className}` : ''}`}>
      <div className="fg-stars" aria-hidden="true" />
      <div className="fg-earth" aria-hidden="true"><span /></div>
      <div className="fg-moon-horizon" aria-hidden="true">
        <i /><i /><i />
      </div>
      <div className="fg-outpost" aria-hidden="true">
        <div className="fg-outpost__wing fg-outpost__wing--left" />
        <div className="fg-outpost__hub" />
        <div className="fg-outpost__wing fg-outpost__wing--right" />
        <div className="fg-outpost__dish" />
      </div>
      {children}
    </div>
  )
}

/* ── Logo (Figma orbit icon) ────────────────────────────────────────────── */
function HeroLogo() {
  return (
    <div className="fg-hero-logo" aria-label="ASTROBASE">
      <div className="fg-logo__orbit" aria-hidden="true">
        <i />
      </div>
      <span className="fg-logo__text">
        ASTRO<b>BASE</b>
      </span>
    </div>
  )
}

/* ── Menu actions ───────────────────────────────────────────────────────── */
const MENU_ITEMS = [
  {
    to:      '/register',
    label:   'BEGIN TRAINING',
    sub:     'Create your trainee profile',
    primary: true,
  },
  {
    to:    '/dashboard',
    label: 'MISSION CONTROL',
    sub:   'View your command centre',
  },
  {
    to:    '/training',
    label: 'TRAINING ACADEMY',
    sub:   'Life-support · Spacewalk protocols',
  },
  {
    to:    '/about',
    label: 'ABOUT THE PROJECT',
    sub:   'NASA Space Apps Challenge 2026',
  },
]

function MenuActions({ trainee }) {
  return (
    <nav className="fg-menu-actions" aria-label="Main menu">
      {MENU_ITEMS.map(({ to, label, sub, primary }) => {
        // If registered, swap "Begin Training" link to dashboard
        const href = (to === '/register' && trainee) ? '/dashboard' : to
        const displayLabel = (to === '/register' && trainee)
          ? 'MISSION CONTROL'
          : label
        const displaySub = (to === '/register' && trainee)
          ? `Welcome back, ${trainee.callsign}`
          : sub
        // Skip duplicate dashboard link when logged in
        if (to === '/dashboard' && trainee) return null

        return (
          <Link
            key={to}
            to={href}
            className={`fg-menu-btn${primary ? ' fg-menu-btn--primary' : ''}`}
          >
            <span className="fg-menu-btn__label">{displayLabel}</span>
            <span className="fg-menu-btn__sub">{displaySub}</span>
          </Link>
        )
      })}
    </nav>
  )
}

/* ── Page root ──────────────────────────────────────────────────────────── */
export default function Home() {
  const { trainee } = useTrainee()

  return (
    <main className="fg-menu-screen">
      <LunarScene>
        {/* Vignette gradient overlay */}
        <div className="fg-menu-vignette" aria-hidden="true" />

        {/* Menu content */}
        <div className="fg-menu-content">
          <p className="fg-menu-kicker">NASA Space Apps Challenge 2026</p>

          <HeroLogo />

          <p className="fg-menu-tagline">
            Futuristic astronaut training. Real space science.
            <br />
            Interactive mission simulation.
          </p>

          <MenuActions trainee={trainee} />

          {trainee && (
            <div className="fg-menu-status" role="status">
              <span className="fg-status-dot" aria-hidden="true" />
              Trainee {trainee.callsign} · {trainee.rank} · Active Session
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="fg-menu-footer" aria-label="Site footer">
          <span>ASTROBASE v1.0 · NASA SPACE APPS 2026</span>
          <span>
            <Link to="/about">About</Link>
            {' · '}
            <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer">
              NASA Open APIs
            </a>
          </span>
        </footer>
      </LunarScene>
    </main>
  )
}
