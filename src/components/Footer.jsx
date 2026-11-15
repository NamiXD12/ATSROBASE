/* ─── Footer ───────────────────────────────────────────────────────────────
   Site footer with brand mark and attribution links.
   Extracted from App.jsx for reuse across pages.
─────────────────────────────────────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-icon" aria-hidden="true">✦</span>
          <span className="logo-text">ASTROBASE</span>
        </div>
        <p className="footer-note">
          Built with ❤️ for the{' '}
          <a
            href="https://www.spaceappschallenge.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            NASA Space Apps Challenge
          </a>
          . Data sourced from{' '}
          <a
            href="https://api.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            NASA Open APIs
          </a>
          .
        </p>
        <p className="footer-copy">
          © {new Date().getFullYear()} ASTROBASE · All rights reserved
        </p>
      </div>
    </footer>
  )
}
