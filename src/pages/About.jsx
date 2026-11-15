/* ─── About page ────────────────────────────────────────────────────────────
   Route: /about — public
   Full about page with project info, tech stack and credits.
─────────────────────────────────────────────────────────────────────────── */
import { Link } from 'react-router-dom'
import StarField from '../components/StarField'

export default function About() {
  return (
    <main className="about-page">
      <StarField />

      <div className="about-inner">
        <div className="about-header">
          <p className="about-eyebrow">NASA Space Apps Challenge 2026</p>
          <h1 className="about-title">About ASTROBASE</h1>
        </div>

        <div className="about-cards">
          <div className="about-card">
            <h2>What is ASTROBASE?</h2>
            <p>
              ASTROBASE is a futuristic astronaut training website built for the
              NASA Space Apps Challenge 2026. It combines visual novel storytelling,
              educational training modules, and interactive mission simulations —
              all grounded in real space science.
            </p>
          </div>

          <div className="about-card">
            <h2>How it works</h2>
            <p>
              Register as a trainee, complete two educational modules covering
              spacecraft life-support systems and spacewalk safety protocols, then
              launch into an interactive mission simulation. Every decision you
              make is explained using real scientific principles drawn from NASA
              educational resources.
            </p>
          </div>

          <div className="about-card">
            <h2>Scientific basis</h2>
            <p>
              Lesson content references publicly available{' '}
              <a href="https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/" target="_blank" rel="noopener noreferrer">
                NASA ECLSS documentation
              </a>{' '}
              and NASA educational materials. All mission scenarios are fictional
              training simulations and do not represent official NASA procedures
              or emergency protocols.
            </p>
          </div>

          <div className="about-card">
            <h2>Technology</h2>
            <p>
              Built with React 19, Vite 8, and React Router. No backend or
              database — all trainee progress is saved locally using the browser's
              localStorage. Fonts: Orbitron and Inter via Google Fonts.
            </p>
          </div>

          <div className="about-card">
            <h2>Data sources</h2>
            <p>
              Space science content references{' '}
              <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer">
                NASA Open APIs
              </a>{' '}
              and the{' '}
              <a href="https://www.spaceappschallenge.org/" target="_blank" rel="noopener noreferrer">
                NASA Space Apps Challenge
              </a>
              . All content is simplified for educational purposes.
            </p>
          </div>
        </div>

        <div className="about-actions">
          <Link to="/register" className="btn-primary">
            🚀 Start Training
          </Link>
          <Link to="/" className="btn-secondary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
