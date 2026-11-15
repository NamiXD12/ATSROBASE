/* ─── DialogueBox — Figma visual integration ───────────────────────────────
   Visual-novel-style dialogue component.
   Phase 2 restyled with Figma's story-screen / dialogue-area patterns.
   All props and logic unchanged.
─────────────────────────────────────────────────────────────────────────── */
import { useEffect, useRef } from 'react'

const AVATAR_CONFIG = {
  commander: {
    emoji: '👩‍✈️', label: 'CDR',
    color: '#ffc861', bg: 'rgba(255,200,97,0.1)', border: 'rgba(255,200,97,0.4)',
  },
  medic: {
    emoji: '👨‍⚕️', label: 'MED',
    color: '#66df9c', bg: 'rgba(102,223,156,0.1)', border: 'rgba(102,223,156,0.4)',
  },
  player: {
    emoji: '🧑‍🚀', label: 'YOU',
    color: '#5ad8f5', bg: 'rgba(90,216,245,0.1)', border: 'rgba(90,216,245,0.4)',
  },
}

export default function DialogueBox({
  scene, sceneIndex, totalScenes, onNext, onBack, traineeCallsign,
}) {
  const isFirst = sceneIndex === 0
  const isLast  = sceneIndex === totalScenes - 1
  const cfg     = AVATAR_CONFIG[scene.avatar] ?? AVATAR_CONFIG.player
  const textRef = useRef(null)

  // Re-trigger fade animation on scene change
  useEffect(() => {
    const el = textRef.current
    if (!el) return
    el.style.animation = 'none'
    void el.offsetHeight
    el.style.animation = ''
  }, [sceneIndex])

  const label = scene.avatar === 'player'
    ? (traineeCallsign || 'YOU')
    : cfg.label

  return (
    <div className="fg-dlg-wrap">
      {/* Scene progress pips */}
      <div className="fg-dlg-pips" aria-label={`Scene ${sceneIndex + 1} of ${totalScenes}`}>
        {Array.from({ length: totalScenes }, (_, i) => (
          <span
            key={i}
            className={`fg-dlg-pip${i === sceneIndex ? ' fg-dlg-pip--active' : i < sceneIndex ? ' fg-dlg-pip--done' : ''}`}
            aria-hidden="true"
          />
        ))}
        <span className="fg-dlg-pip-count">{sceneIndex + 1} / {totalScenes}</span>
      </div>

      {/* Dialogue box — Figma .dialogue-area style */}
      <div className="fg-dlg-box">
        {/* Speaker name bar */}
        <div className="fg-dlg-speaker">
          <i style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} aria-hidden="true" />
          <span className="fg-dlg-speaker-name" style={{ color: cfg.color }}>{scene.speaker}</span>
          <span className="fg-dlg-speaker-role">{scene.role}</span>
          {/* Large portrait (right side) */}
          <div
            className="fg-dlg-portrait"
            style={{ borderColor: cfg.border, background: cfg.bg }}
            aria-hidden="true"
          >
            <span className="fg-dlg-portrait-emoji">{cfg.emoji}</span>
            <span className="fg-dlg-portrait-label" style={{ color: cfg.color }}>{label}</span>
          </div>
        </div>

        {/* Dialogue text with fade-in animation */}
        <p className="fg-dlg-text" ref={textRef}>{scene.text}</p>

        {/* Keyboard hint */}
        <p className="fg-dlg-hint" aria-hidden="true">
          Click Continue to advance · Esc not supported
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="fg-dlg-nav">
        {!isFirst && (
          <button className="fg-dlg-btn fg-dlg-btn--back" onClick={onBack}>
            ← Back
          </button>
        )}
        <button className="fg-dlg-btn fg-dlg-btn--next" onClick={onNext}>
          {isLast ? 'Begin Mission →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}
