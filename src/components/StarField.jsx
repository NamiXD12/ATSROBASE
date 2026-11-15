/* ─── StarField ────────────────────────────────────────────────────────────
   Renders 150 deterministic twinkling stars as a full-coverage background.
   Extracted from App.jsx for reuse across pages.
─────────────────────────────────────────────────────────────────────────── */

export default function StarField() {
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    left: ((i * 73 + 17) % 100),
    top: ((i * 47 + 31) % 100),
    size: ((i % 3) + 1),
    delay: ((i * 0.13) % 4).toFixed(2),
    duration: (2.5 + (i % 3) * 0.8).toFixed(1),
    opacity: (0.3 + (i % 7) * 0.1).toFixed(1),
  }))

  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  )
}
