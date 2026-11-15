/* ─── Planets ──────────────────────────────────────────────────────────────
   Four floating CSS planets used in the hero section.
   Extracted from App.jsx for reuse across pages.
─────────────────────────────────────────────────────────────────────────── */

export default function Planets() {
  return (
    <div className="planets" aria-hidden="true">
      {/* Large purple planet – top right */}
      <div className="planet planet-1">
        <div className="planet-ring" />
      </div>
      {/* Medium blue planet – bottom left */}
      <div className="planet planet-2" />
      {/* Small teal planet – centre-right */}
      <div className="planet planet-3" />
      {/* Tiny dot accent */}
      <div className="planet planet-4" />
    </div>
  )
}
